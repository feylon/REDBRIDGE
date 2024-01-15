import { User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

export const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Login yoki parol noto'g'ri");
  }

  res.json({ token: signToken(user), user });
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw ApiError.badRequest("Joriy parol noto'g'ri");
  }

  user.password = req.body.newPassword;
  await user.save();
  res.json({ message: "Parol muvaffaqiyatli o'zgartirildi" });
});
