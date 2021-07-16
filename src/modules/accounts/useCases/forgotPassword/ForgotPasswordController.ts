import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

export class ForgotPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);

    const { email } = req.body;

    await forgotPasswordUseCase.execute(email);

    return res.status(200).send();
  }
}
