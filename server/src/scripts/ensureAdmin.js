import env from '../config/env.js';
import { ROLES, User } from '../models/index.js';

export default async function ensureAdmin() {
  const exists = await User.exists({ role: ROLES.ADMIN });
  if (exists) return;

  await User.create({
    firstName: 'Administrator',
    userName: env.admin.userName,
    password: env.admin.password,
    role: ROLES.ADMIN,
  });

  console.log(`Administrator yaratildi: ${env.admin.userName}`);
}
