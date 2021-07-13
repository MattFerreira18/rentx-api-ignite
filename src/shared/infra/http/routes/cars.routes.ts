import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@configs/upload';
import { CreateCarController } from '@modules/cars/useCases/cars/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/cars/createCarSpecification/CreateCarSpecificationController';
import { ListAvailableCarsController } from '@modules/cars/useCases/cars/listAvailableCars/ListAvailableCarsController';
import { UploadCarImageController } from '@modules/cars/useCases/cars/uploadCarImage/UploadCarImageController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated';

const router = Router();

const uploadImage = multer(uploadConfig.upload('./tmp/cars'));

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationsController = new CreateCarSpecificationController();
const uploadCarImageController = new UploadCarImageController();

router.post('/', ensureAuthenticated, ensureAdmin, createCarController.handle);
router.get('/available', listAvailableCarsController.handle);
router.post(
  '/specifications/:carId',
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationsController.handle,
);

router.post(
  '/images/:carId',
  ensureAuthenticated,
  ensureAdmin,
  uploadImage.array('images'),
  uploadCarImageController.handle,
);

export default router;
