import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';

import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated';

const router = Router();

const createRentalController = new CreateRentalController();
const listRentalsByUserController = new ListRentalsByUserController();
const devolutionRentalController = new DevolutionRentalController();

router.post('/', ensureAuthenticated, createRentalController.handle);

router.post(
  '/devolution/:rentalId',
  ensureAuthenticated,
  devolutionRentalController.handle,
);

router.get('/user', ensureAuthenticated, listRentalsByUserController.handle);

export default router;
