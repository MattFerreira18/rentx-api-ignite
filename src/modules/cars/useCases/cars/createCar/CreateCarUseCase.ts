import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { ICreateCarDTO } from '../../../dtos/ICarDTO';
import Car from '../../../infra/database/entities/Car';
import { ICarsRepository } from '../../../repositories/ICarsRepository';

@injectable()
export class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({
    name,
    description,
    dailyRate,
    licensePlate,
    fineAmount,
    brand,
    categoryId,
    available = true,
  }: ICreateCarDTO): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      licensePlate,
    );

    if (carAlreadyExists) {
      throw new AppError({
        statusCode: 400,
        message: 'car already exists',
      });
    }

    const car = await this.carsRepository.create({
      name,
      description,
      dailyRate,
      licensePlate,
      fineAmount,
      brand,
      categoryId,
      available,
    });

    return car;
  }
}
