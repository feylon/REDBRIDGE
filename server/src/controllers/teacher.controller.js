import { Grade, ROLES, Subject, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { byName, escapeRegex } from '../utils/sort.js';

async function findTeacher(id) {
  const teacher = await User.findOne({ _id: id, role: ROLES.TEACHER });
  if (!teacher) throw ApiError.notFound("O'qituvchi topilmadi");
  return teacher;
}

export const list = asyncHandler(async (req, res) => {
  const filter = { role: ROLES.TEACHER };

  if (req.query.search) {
    const pattern = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ firstName: pattern }, { lastName: pattern }, { userName: pattern }];
  }

  const teachers = await User.find(filter).sort(byName).lean();
  const ids = teachers.map((teacher) => teacher._id);

  const [subjectCounts, curated] = await Promise.all([
    Subject.aggregate([
      { $match: { teacher: { $in: ids } } },
      { $group: { _id: '$teacher', count: { $sum: 1 } } },
    ]),
    Grade.find({ curator: { $in: ids } }).select('name curator').lean(),
  ]);

  const countMap = new Map(subjectCounts.map((item) => [String(item._id), item.count]));
  const gradeMap = new Map(curated.map((grade) => [String(grade.curator), grade.name]));

  res.json(
    teachers.map(({ _id, password: _password, __v, ...teacher }) => ({
      ...teacher,
      id: String(_id),
      fullName: [teacher.lastName, teacher.firstName, teacher.fatherName].filter(Boolean).join(' '),
      subjectsCount: countMap.get(String(_id)) || 0,
      curatorOf: gradeMap.get(String(_id)) || null,
    })),
  );
});

export const getOne = asyncHandler(async (req, res) => {
  const teacher = await findTeacher(req.params.id);
  const subjects = await Subject.find({ teacher: teacher.id }).populate('grade', 'name').sort('name');
  res.json({ ...teacher.toJSON(), subjects });
});

export const create = asyncHandler(async (req, res) => {
  const exists = await User.exists({ userName: req.body.userName });
  if (exists) throw ApiError.conflict('Bu login band');

  const teacher = await User.create({ ...req.body, role: ROLES.TEACHER });
  res.status(201).json(teacher);
});

export const update = asyncHandler(async (req, res) => {
  const teacher = await findTeacher(req.params.id);
  Object.assign(teacher, req.body);
  await teacher.save();
  res.json(teacher);
});

export const remove = asyncHandler(async (req, res) => {
  const teacher = await findTeacher(req.params.id);

  await Promise.all([
    Subject.updateMany({ teacher: teacher.id }, { teacher: null }),
    Grade.updateMany({ curator: teacher.id }, { curator: null }),
    teacher.deleteOne(),
  ]);

  res.status(204).end();
});
