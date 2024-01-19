import { Grade, Score, Student, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { byName, escapeRegex } from '../utils/sort.js';

async function findStudent(id) {
  const student = await Student.findById(id);
  if (!student) throw ApiError.notFound("O'quvchi topilmadi");
  return student;
}

async function assertGrade(id) {
  const exists = await Grade.exists({ _id: id });
  if (!exists) throw ApiError.badRequest('Sinf topilmadi');
}

export const list = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.grade) filter.grade = req.query.grade;
  if (req.query.search) {
    const pattern = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ firstName: pattern }, { lastName: pattern }, { fatherName: pattern }];
  }

  const students = await Student.find(filter).populate('grade', 'name').sort(byName).limit(200);
  res.json(students);
});

export const getOne = asyncHandler(async (req, res) => {
  const student = await findStudent(req.params.id);
  await student.populate('grade', 'name');
  res.json(student);
});

export const create = asyncHandler(async (req, res) => {
  await assertGrade(req.body.grade);
  const student = await Student.create(req.body);
  res.status(201).json(student);
});

export const update = asyncHandler(async (req, res) => {
  const student = await findStudent(req.params.id);
  if (req.body.grade) await assertGrade(req.body.grade);
  Object.assign(student, req.body);
  await student.save();
  res.json(student);
});

export const remove = asyncHandler(async (req, res) => {
  const student = await findStudent(req.params.id);

  await Promise.all([
    Score.deleteMany({ student: student.id }),
    User.updateMany({ children: student.id }, { $pull: { children: student.id } }),
    student.deleteOne(),
  ]);

  res.status(204).end();
});
