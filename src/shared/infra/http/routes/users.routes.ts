import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@configs/upload';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { ListAllUsersController } from '@modules/accounts/useCases/listAllUsers/ListAllUsersController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';

import { ensureAuthenticated } from '../middlewares/EnsureAuthenticated';

const router = Router();
const uploadAvatar = multer(uploadConfig.upload('./tmp/avatar'));

const createUserController = new CreateUserController();
const listAllUsersController = new ListAllUsersController();
const updateUserAvatarController = new UpdateUserAvatarController();

router.post('/', createUserController.handle);
router.get('/all', listAllUsersController.handle);
router.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'), // file name
  updateUserAvatarController.handle,
);

export default router;
