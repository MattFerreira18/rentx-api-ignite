import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProfileUserUseCase } from './ProfileUserUseCase';

export class ProfileUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const profileUserUseCase = container.resolve(ProfileUserUseCase);

    const { id: userId } = req.user;

    const profile = await profileUserUseCase.execute(userId);

    return res.status(200).json(profile);
  }
}
