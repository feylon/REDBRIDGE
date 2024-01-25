import { Router } from 'express';
import mongoose from 'mongoose';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '../models/index.js';
import { overview } from '../controllers/stats.controller.js';
import authRoutes from './auth.routes.js';
import teacherRoutes from './teacher.routes.js';
import gradeRoutes from './grade.routes.js';
import subjectRoutes from './subject.routes.js';
import studentRoutes from './student.routes.js';
import parentRoutes from './parent.routes.js';
import scoreRoutes from './score.routes.js';

const router = Router();
const adminOnly = [authenticate, authorize(ROLES.ADMIN)];

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

router.use('/auth', authRoutes);
router.get('/stats', adminOnly, overview);
router.use('/teachers', adminOnly, teacherRoutes);
router.use('/grades', adminOnly, gradeRoutes);
router.use('/subjects', adminOnly, subjectRoutes);
router.use('/students', adminOnly, studentRoutes);
router.use('/parents', adminOnly, parentRoutes);
router.use('/scores', adminOnly, scoreRoutes);

export default router;
