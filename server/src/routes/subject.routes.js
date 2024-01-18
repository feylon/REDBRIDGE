import { Router } from 'express';
import * as controller from '../controllers/subject.controller.js';
import validate from '../middlewares/validate.js';
import * as schema from '../validators/subject.validator.js';

const router = Router();

router.post('/', validate(schema.create), controller.create);
router
  .route('/:id')
  .patch(validate(schema.update), controller.update)
  .delete(validate(schema.byId), controller.remove);

export default router;
