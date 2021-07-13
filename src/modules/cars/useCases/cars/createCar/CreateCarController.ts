import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ICreateCarDTO } from '@src/modules/cars/dtos/ICarDTO';

import { CreateCarUseCase } from './CreateCarUseCase';

export class CreateCarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createCarUseCase = container.resolve(CreateCarUseCase);

    const {
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      available,
      specifications,
    }: ICreateCarDTO = req.body;

    const car = await createCarUseCase.execute({
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      available,
      specifications,
    });

    return res.status(201).json(car);
  }
}
