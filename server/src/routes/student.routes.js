import { Router } from 'express';
import * as controller from '../controllers/student.controller.js';
import validate from '../middlewares/validate.js';
import * as schema from '../validators/student.validator.js';

const router = Router();

router.route('/').get(validate(schema.list), controller.list).post(validate(schema.create), controller.create);

router
  .route('/:id')
  .get(validate(schema.byId), controller.getOne)
  .patch(validate(schema.update), controller.update)
  .delete(validate(schema.byId), controller.remove);

export default router;
