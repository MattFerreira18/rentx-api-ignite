import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUseCase } from './ResetPasswordUseCase';

export class ResetPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    const { token } = req.query;
    const { password } = req.body;

    await resetPasswordUseCase.execute({
      token: String(token),
      password,
    });

    return res.status(201).send();
  }
}
