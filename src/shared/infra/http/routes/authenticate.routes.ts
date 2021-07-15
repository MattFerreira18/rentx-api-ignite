import { Router } from 'express';

import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { RefreshTokenController } from '@src/modules/accounts/useCases/refreshToken/RefreshTokenController';

const router = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

router.post('/auth', authenticateUserController.handle);
router.post('/refresh-token', refreshTokenController.handle);

export default router;
