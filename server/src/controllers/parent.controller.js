import { ROLES, Score, Student, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { escapeRegex } from '../utils/sort.js';

async function findParent(id) {
  const parent = await User.findOne({ _id: id, role: ROLES.PARENT });
  if (!parent) throw ApiError.notFound('Ota-ona topilmadi');
  return parent;
}

async function childrenWithStats(ids) {
  const children = await Student.find({ _id: { $in: ids } }).populate('grade', 'name');
  const stats = await Score.aggregate([
    { $match: { student: { $in: children.map((child) => child._id) } } },
    {
      $group: {
        _id: '$student',
        count: { $sum: 1 },
        total: { $sum: '$value' },
        average: { $avg: '$value' },
      },
    },
  ]);
  const statMap = new Map(stats.map((item) => [String(item._id), item]));

  return children.map((child) => {
    const stat = statMap.get(child.id);
    return {
      ...child.toJSON(),
      scoresCount: stat?.count || 0,
      totalScore: stat?.total || 0,
      average: stat ? Math.round(stat.average * 100) / 100 : null,
    };
  });
}

export const list = asyncHandler(async (req, res) => {
  const filter = { role: ROLES.PARENT };

  if (req.query.search) {
    const pattern = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ firstName: pattern }, { lastName: pattern }, { userName: pattern }];
  }

  const parents = await User.find(filter).sort('userName');
  res.json(parents.map((parent) => ({ ...parent.toJSON(), childrenCount: parent.children.length })));
});

export const getOne = asyncHandler(async (req, res) => {
  const parent = await findParent(req.params.id);
  const children = await childrenWithStats(parent.children);
  res.json({ ...parent.toJSON(), children });
});

export const create = asyncHandler(async (req, res) => {
  const exists = await User.exists({ userName: req.body.userName });
  if (exists) throw ApiError.conflict('Bu login band');

  const parent = await User.create({ ...req.body, role: ROLES.PARENT });
  res.status(201).json(parent);
});

export const remove = asyncHandler(async (req, res) => {
  const parent = await findParent(req.params.id);
  await parent.deleteOne();
  res.status(204).end();
});

export const addChild = asyncHandler(async (req, res) => {
  const parent = await findParent(req.params.id);
  const studentExists = await Student.exists({ _id: req.body.studentId });
  if (!studentExists) throw ApiError.notFound("O'quvchi topilmadi");

  if (parent.children.some((child) => String(child) === req.body.studentId)) {
    throw ApiError.conflict("Bu o'quvchi allaqachon biriktirilgan");
  }

  parent.children.push(req.body.studentId);
  await parent.save();
  res.status(201).json({ ...parent.toJSON(), children: await childrenWithStats(parent.children) });
});

export const removeChild = asyncHandler(async (req, res) => {
  const parent = await findParent(req.params.id);
  parent.children.pull(req.params.studentId);
  await parent.save();
  res.json({ ...parent.toJSON(), children: await childrenWithStats(parent.children) });
});
