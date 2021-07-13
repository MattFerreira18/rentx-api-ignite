import { Router } from 'express';

import { CreateSpecificationController } from '@modules/cars/useCases/specification/createSpecification/CreateSpecificationController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated';

const router = Router();

const createSpecificationController = new CreateSpecificationController();

router.use(ensureAuthenticated);

router.post('/', ensureAdmin, createSpecificationController.handle);

export default router;
