import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

export class ListRentalsByUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const listRentalsByUserUseCase = container.resolve(
      ListRentalsByUserUseCase,
    );

    const { id: userId } = req.user;

    const rentals = await listRentalsByUserUseCase.execute(userId);

    return res.status(200).json(rentals);
  }
}
