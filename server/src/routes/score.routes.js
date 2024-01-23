import { Router } from 'express';
import * as controller from '../controllers/score.controller.js';
import validate from '../middlewares/validate.js';
import * as schema from '../validators/score.validator.js';

const router = Router();

router.route('/').get(validate(schema.list), controller.list).post(validate(schema.create), controller.create);
router.delete('/:id', validate(schema.byId), controller.remove);

export default router;
