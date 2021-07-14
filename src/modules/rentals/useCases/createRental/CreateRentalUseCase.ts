import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IDateProvider } from '@providers/dateProvider/IDateProvider';

import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { AlreadyRentalInProgress } from '../../errors/AlreadyRentalInProgress';
import { CarNotFound } from '../../errors/CarNotFound';
import { InvalidReturnTime } from '../../errors/InvalidReturnTime';
import { UnavailableCar } from '../../errors/UnavailableCar';
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
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    userId,
    carId,
    expectedReturnDate,
  }: IRequest): Promise<Rental> {
    const carExists = await this.carsRepository.findById(carId);

    if (!carExists) {
      throw new CarNotFound();
    }

    const availableCar = await this.rentalsRepository.findOpenRentalByCarId(
      carId,
    );

    if (availableCar) {
      throw new UnavailableCar();
    }

    const user = await this.rentalsRepository.findOpenRentalByUserId(userId);

    if (user) {
      throw new AlreadyRentalInProgress();
    }

    const compareDate = this.dateProvider.compareInHours({
      endDate: expectedReturnDate,
    });

    // compare the date with a minimum of a day (24 hours)
    if (compareDate < 24) {
      throw new InvalidReturnTime();
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
