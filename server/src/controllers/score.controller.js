import { Score, Student, Subject } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const scores = await Score.find({
    student: req.query.student,
    subject: req.query.subject,
  }).sort('-date');
  res.json(scores);
});

export const create = asyncHandler(async (req, res) => {
  const [student, subject] = await Promise.all([
    Student.findById(req.body.student),
    Subject.findById(req.body.subject),
  ]);

  if (!student || !subject) throw ApiError.notFound("O'quvchi yoki fan topilmadi");
  if (String(student.grade) !== String(subject.grade)) {
    throw ApiError.badRequest("Fan o'quvchining sinfiga tegishli emas");
  }

  const score = await Score.create(req.body);
  res.status(201).json(score);
});

export const remove = asyncHandler(async (req, res) => {
  const score = await Score.findByIdAndDelete(req.params.id);
  if (!score) throw ApiError.notFound('Baho topilmadi');
  res.status(204).end();
});
