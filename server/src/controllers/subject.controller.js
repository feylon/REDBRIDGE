import { Grade, ROLES, Score, Subject, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const teacherFields = 'firstName lastName fatherName userName';

async function assertTeacher(teacher) {
  if (!teacher) return null;
  const exists = await User.exists({ _id: teacher, role: ROLES.TEACHER });
  if (!exists) throw ApiError.badRequest("Tanlangan o'qituvchi topilmadi");
  return teacher;
}

async function findSubject(id) {
  const subject = await Subject.findById(id);
  if (!subject) throw ApiError.notFound('Fan topilmadi');
  return subject;
}

export const create = asyncHandler(async (req, res) => {
  const gradeExists = await Grade.exists({ _id: req.body.grade });
  if (!gradeExists) throw ApiError.badRequest('Sinf topilmadi');

  const teacher = await assertTeacher(req.body.teacher);
  const subject = await Subject.create({ ...req.body, teacher });
  await subject.populate('teacher', teacherFields);
  res.status(201).json(subject);
});

export const update = asyncHandler(async (req, res) => {
  const subject = await findSubject(req.params.id);
  if ('teacher' in req.body) {
    req.body.teacher = await assertTeacher(req.body.teacher);
  }
  Object.assign(subject, req.body);
  await subject.save();
  await subject.populate('teacher', teacherFields);
  res.json(subject);
});

export const remove = asyncHandler(async (req, res) => {
  const subject = await findSubject(req.params.id);
  await Promise.all([Score.deleteMany({ subject: subject.id }), subject.deleteOne()]);
  res.status(204).end();
});
