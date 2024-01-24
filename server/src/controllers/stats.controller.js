import { Grade, ROLES, Score, Student, Subject, User } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';

export const overview = asyncHandler(async (_req, res) => {
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [teachers, parents, grades, students, subjects, activeStudents, distribution, recentScores, topGrades] =
    await Promise.all([
      User.countDocuments({ role: ROLES.TEACHER }),
      User.countDocuments({ role: ROLES.PARENT }),
      Grade.countDocuments(),
      Student.countDocuments(),
      Subject.countDocuments(),
      Student.countDocuments({ activeDate: { $gte: now } }),
      Score.aggregate([
        { $match: { date: { $gte: monthAgo } } },
        { $group: { _id: '$value', count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]),
      Score.find()
        .sort('-createdAt')
        .limit(6)
        .populate('student', 'firstName lastName')
        .populate('subject', 'name'),
      Score.aggregate([
        { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'student' } },
        { $unwind: '$student' },
        { $group: { _id: '$student.grade', average: { $avg: '$value' }, count: { $sum: 1 } } },
        { $sort: { average: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'grades', localField: '_id', foreignField: '_id', as: 'grade' } },
        { $unwind: '$grade' },
        { $project: { _id: 0, id: '$_id', name: '$grade.name', count: 1, average: { $round: ['$average', 2] } } },
      ]),
    ]);

  res.json({
    counts: { teachers, parents, grades, students, subjects, activeStudents },
    distribution: [5, 4, 3, 2].map((value) => ({
      value,
      count: distribution.find((item) => item._id === value)?.count || 0,
    })),
    recentScores,
    topGrades,
  });
});
