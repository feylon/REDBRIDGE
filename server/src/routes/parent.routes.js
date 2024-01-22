import { Router } from 'express';
import * as controller from '../controllers/parent.controller.js';
import validate from '../middlewares/validate.js';
import * as schema from '../validators/parent.validator.js';

const router = Router();

router.route('/').get(validate(schema.list), controller.list).post(validate(schema.create), controller.create);

router
  .route('/:id')
  .get(validate(schema.byId), controller.getOne)
  .delete(validate(schema.byId), controller.remove);

router.post('/:id/children', validate(schema.addChild), controller.addChild);
router.delete('/:id/children/:studentId', validate(schema.removeChild), controller.removeChild);

export default router;
