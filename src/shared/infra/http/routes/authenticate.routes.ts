import { Router } from 'express';

import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { ForgotPasswordController } from '@src/modules/accounts/useCases/forgotPassword/ForgotPasswordController';
import { RefreshTokenController } from '@src/modules/accounts/useCases/refreshToken/RefreshTokenController';
import { ResetPasswordController } from '@src/modules/accounts/useCases/resetPassword/ResetPasswordController';

const router = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

router.post('/auth', authenticateUserController.handle);
router.post('/refresh-token', refreshTokenController.handle);
router.get('/forgot-password', forgotPasswordController.handle);
router.patch('/reset', resetPasswordController.handle);

export default router;
