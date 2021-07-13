import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

class AuthenticateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const { email, password } = req.body;

    const { user, token }: IResponse = await authenticateUserUseCase.execute({
      email,
      password,
    });

    return res.status(200).json({ user, token });
  }
}

export { AuthenticateUserController };
