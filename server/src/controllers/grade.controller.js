import { Grade, ROLES, Score, Student, Subject, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { byName } from '../utils/sort.js';

const curatorFields = 'firstName lastName fatherName userName';

async function findGrade(id) {
  const grade = await Grade.findById(id).populate('curator', curatorFields);
  if (!grade) throw ApiError.notFound('Sinf topilmadi');
  return grade;
}

async function assertCurator(curator) {
  if (!curator) return null;
  const exists = await User.exists({ _id: curator, role: ROLES.TEACHER });
  if (!exists) throw ApiError.badRequest("Sinf rahbari sifatida o'qituvchi tanlanishi kerak");
  return curator;
}

function countBy(Model, ids) {
  return Model.aggregate([
    { $match: { grade: { $in: ids } } },
    { $group: { _id: '$grade', count: { $sum: 1 } } },
  ]).then((rows) => new Map(rows.map((row) => [String(row._id), row.count])));
}

export const list = asyncHandler(async (_req, res) => {
  const grades = await Grade.find()
    .populate('curator', curatorFields)
    .collation({ locale: 'en', numericOrdering: true })
    .sort('name');
  const ids = grades.map((grade) => grade._id);
  const [students, subjects] = await Promise.all([countBy(Student, ids), countBy(Subject, ids)]);

  res.json(
    grades.map((grade) => ({
      ...grade.toJSON(),
      studentsCount: students.get(grade.id) || 0,
      subjectsCount: subjects.get(grade.id) || 0,
    })),
  );
});

export const getOne = asyncHandler(async (req, res) => {
  const grade = await findGrade(req.params.id);
  const [studentsCount, subjectsCount] = await Promise.all([
    Student.countDocuments({ grade: grade.id }),
    Subject.countDocuments({ grade: grade.id }),
  ]);
  res.json({ ...grade.toJSON(), studentsCount, subjectsCount });
});

export const create = asyncHandler(async (req, res) => {
  const curator = await assertCurator(req.body.curator);
  const grade = await Grade.create({ ...req.body, curator });
  await grade.populate('curator', curatorFields);
  res.status(201).json(grade);
});

export const update = asyncHandler(async (req, res) => {
  const grade = await findGrade(req.params.id);
  if ('curator' in req.body) {
    req.body.curator = await assertCurator(req.body.curator);
  }
  Object.assign(grade, req.body);
  await grade.save();
  await grade.populate('curator', curatorFields);
  res.json(grade);
});

export const remove = asyncHandler(async (req, res) => {
  const grade = await findGrade(req.params.id);
  const [students, subjects] = await Promise.all([
    Student.find({ grade: grade.id }).distinct('_id'),
    Subject.find({ grade: grade.id }).distinct('_id'),
  ]);

  await Promise.all([
    Score.deleteMany({ $or: [{ student: { $in: students } }, { subject: { $in: subjects } }] }),
    User.updateMany({ children: { $in: students } }, { $pull: { children: { $in: students } } }),
    Student.deleteMany({ grade: grade.id }),
    Subject.deleteMany({ grade: grade.id }),
    grade.deleteOne(),
  ]);

  res.status(204).end();
});

export const subjects = asyncHandler(async (req, res) => {
  await findGrade(req.params.id);
  const items = await Subject.find({ grade: req.params.id })
    .populate('teacher', curatorFields)
    .sort('name');
  res.json(items);
});

export const students = asyncHandler(async (req, res) => {
  await findGrade(req.params.id);
  const items = await Student.find({ grade: req.params.id }).sort(byName);
  res.json(items);
});

export const journal = asyncHandler(async (req, res) => {
  const grade = await findGrade(req.params.id);
  const [studentList, subjectList] = await Promise.all([
    Student.find({ grade: grade.id }).sort(byName),
    Subject.find({ grade: grade.id }).sort('name'),
  ]);

  const stats = await Score.aggregate([
    {
      $match: {
        student: { $in: studentList.map((item) => item._id) },
        subject: { $in: subjectList.map((item) => item._id) },
      },
    },
    { $sort: { date: 1 } },
    {
      $group: {
        _id: { student: '$student', subject: '$subject' },
        count: { $sum: 1 },
        total: { $sum: '$value' },
        average: { $avg: '$value' },
        last: { $last: '$value' },
      },
    },
  ]);

  const scores = stats.map((item) => ({
    studentId: String(item._id.student),
    subjectId: String(item._id.subject),
    count: item.count,
    total: item.total,
    last: item.last,
    average: Math.round(item.average * 100) / 100,
    percentage: Math.round((item.average / 5) * 100),
  }));

  res.json({ grade, students: studentList, subjects: subjectList, scores });
});

