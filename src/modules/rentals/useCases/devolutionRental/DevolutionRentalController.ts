import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

export class DevolutionRentalController {
  async handle(req: Request, res: Response): Promise<Response> {
    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);

    const { rentalId } = req.params;
    const { id: userId } = req.user;

    const rental = await devolutionRentalUseCase.execute({ rentalId, userId });

    return res.status(200).json(rental);
  }
}
