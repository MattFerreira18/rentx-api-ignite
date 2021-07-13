import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRentalUseCase } from './CreateRentalUseCase';

export class CreateRentalController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createRentalUseCase = container.resolve(CreateRentalUseCase);

    const { id: userId } = req.user;
    const { expectedReturnDate, carId } = req.body;

    const rental = await createRentalUseCase.execute({
      carId,
      userId,
      expectedReturnDate,
    });

    return res.status(201).json(rental);
  }
}
