import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IDateProvider } from '@providers/dateProvider/IDateProvider';

import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { Rental } from '../../infra/database/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

interface IRequest {
  userId: string;
  carId: string;
  expectedReturnDate: Date;
}

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({
    userId,
    carId,
    expectedReturnDate,
  }: IRequest): Promise<Rental> {
    const availableCar = await this.rentalsRepository.findOpenRentalByCarId(
      carId,
    );

    if (availableCar) {
      throw new AppError({ statusCode: 404, message: 'car is unavailable' });
    }

    const user = await this.rentalsRepository.findOpenRentalByUserId(userId);

    if (user) {
      throw new AppError({
        statusCode: 409,
        message: "there's a rental in progress for user",
      });
    }

    const compareDate = this.dateProvider.compareInHours({
      endDate: expectedReturnDate,
    });

    // compare the date with a minimum of a day (24 hours)
    if (compareDate < 24) {
      throw new AppError({ statusCode: 400, message: 'invalid return time' });
    }

    const rental = await this.rentalsRepository.create({
      userId,
      carId,
      expectedReturnDate,
    });

    await this.carsRepository.updateAvailable(carId, false);

    return rental;
  }
}
