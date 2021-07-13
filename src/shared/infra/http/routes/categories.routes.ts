import { Router } from 'express';
import multer from 'multer';

import { CreateCategoryController } from '@modules/cars/useCases/category/createCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCases/category/importCategory/ImportCategoryController';
import { ListAllCategoriesController } from '@modules/cars/useCases/category/listAllCategories/ListAllCategoriesController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated';

const router = Router();
const upload = multer({ dest: './tmp' });

const createCategoryController = new CreateCategoryController();
const listAllCategoriesController = new ListAllCategoriesController();
const importCategoryController = new ImportCategoryController();

router.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCategoryController.handle,
);

router.get('/all', ensureAuthenticated, listAllCategoriesController.handle);

router.post(
  '/import',
  ensureAuthenticated,
  ensureAdmin,
  upload.single('file'),
  importCategoryController.handle,
);

export default router;
