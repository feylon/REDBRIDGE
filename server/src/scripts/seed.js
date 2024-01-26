import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Grade, ROLES, Score, Student, Subject, User } from '../models/index.js';
import ensureAdmin from './ensureAdmin.js';

const teachers = [
  ['Dilnoza', 'Karimova', 'Anvarovna', 'd.karimova', 'Matematika'],
  ['Jasur', 'Rahimov', 'Bahodirovich', 'j.rahimov', 'Fizika'],
  ['Malika', 'Tursunova', 'Shavkatovna', 'm.tursunova', 'Ona tili'],
  ['Sardor', 'Aliyev', 'Ilhomovich', 's.aliyev', 'Ingliz tili'],
  ['Nodira', 'Yusupova', 'Rustamovna', 'n.yusupova', 'Biologiya'],
  ['Otabek', 'Qodirov', 'Farhodovich', 'o.qodirov', 'Tarix'],
];

const firstNames = ['Aziz', 'Madina', 'Bekzod', 'Sevara', 'Javohir', 'Zarina', 'Shoxrux', 'Nilufar', 'Doniyor', 'Kamola', 'Sherzod', 'Gulnoza'];
const lastNames = ['Ismoilov', 'Xolmatova', 'Ergashev', 'Saidova', 'Nurmatov', 'Abdullayeva', 'Mirzayev', 'Sobirova', 'Hasanov', 'Umarova', 'Toshpulatov', 'Rasulova'];
const fatherNames = ['Akmalovich', 'Bahromovna', 'Olimovich', 'Rustamovna', 'Erkinovich', 'Sanjarovna'];

const pick = (list, index) => list[index % list.length];
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seed() {
  await connectDatabase();

  await Promise.all([
    Score.deleteMany({}),
    Student.deleteMany({}),
    Subject.deleteMany({}),
    Grade.deleteMany({}),
    User.deleteMany({ role: { $ne: ROLES.ADMIN } }),
  ]);
  await ensureAdmin();

  const teacherDocs = [];
  for (const [firstName, lastName, fatherName, userName] of teachers) {
    teacherDocs.push(
      await User.create({ firstName, lastName, fatherName, userName, password: 'teacher123', role: ROLES.TEACHER }),
    );
  }

  const gradeNames = ['5-A', '6-B', '7-A', '9-V'];
  const grades = await Grade.insertMany(
    gradeNames.map((name, index) => ({ name, curator: teacherDocs[index].id, room: String(101 + index) })),
  );

  const parents = [];
  for (let index = 0; index < 4; index += 1) {
    parents.push(
      await User.create({
        firstName: pick(firstNames, index + 3),
        lastName: pick(lastNames, index + 5),
        userName: `parent${index + 1}`,
        password: 'parent123',
        role: ROLES.PARENT,
      }),
    );
  }

  let counter = 0;
  for (const grade of grades) {
    const subjects = await Subject.insertMany(
      teachers.map(([, , , , subjectName], index) => ({
        name: subjectName,
        grade: grade.id,
        teacher: teacherDocs[index].id,
        hoursPerWeek: random(2, 5),
      })),
    );

    const students = await Student.insertMany(
      Array.from({ length: 8 }, () => {
        counter += 1;
        return {
          firstName: pick(firstNames, counter * 7),
          lastName: pick(lastNames, counter * 5),
          fatherName: pick(fatherNames, counter),
          grade: grade.id,
          birthDate: new Date(2008 + random(0, 5), random(0, 11), random(1, 28)),
          activeDate: new Date(Date.now() + random(-20, 120) * 24 * 60 * 60 * 1000),
        };
      }),
    );

    const scores = [];
    for (const student of students) {
      const level = random(3, 5);
      for (const subject of subjects) {
        for (let index = 0; index < random(3, 7); index += 1) {
          scores.push({
            student: student.id,
            subject: subject.id,
            value: Math.max(2, Math.min(5, level + random(-1, 1))),
            date: new Date(Date.now() - random(0, 60) * 24 * 60 * 60 * 1000),
          });
        }
      }
    }
    await Score.insertMany(scores);

    parents[grades.indexOf(grade)].children.push(students[0].id, students[1].id);
    await parents[grades.indexOf(grade)].save();
  }

  console.log("Demo maʼlumotlar muvaffaqiyatli qo'shildi");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
