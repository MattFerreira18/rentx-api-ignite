import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

class AuthenticateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const { email, password } = req.body;

    const { user, token, refreshToken } = await authenticateUserUseCase.execute({
      email,
      password,
    });

    return res.status(200).json({ user, token, refreshToken });
  }
}

export { AuthenticateUserController };
