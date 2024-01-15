import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import * as schema from '../validators/auth.validator.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring" },
});

router.post('/login', loginLimiter, validate(schema.login), controller.login);
router.get('/me', authenticate, controller.me);
router.patch('/password', authenticate, validate(schema.changePassword), controller.changePassword);

export default router;
