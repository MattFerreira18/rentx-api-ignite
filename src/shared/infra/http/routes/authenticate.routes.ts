import { Router } from 'express';

import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { ForgotPasswordController } from '@src/modules/accounts/useCases/forgotPassword/ForgotPasswordController';
import { RefreshTokenController } from '@src/modules/accounts/useCases/refreshToken/RefreshTokenController';

const router = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();
const forgotPasswordController = new ForgotPasswordController();

router.post('/auth', authenticateUserController.handle);
router.post('/refresh-token', refreshTokenController.handle);
router.get('/forgot-password', forgotPasswordController.handle);

export default router;
