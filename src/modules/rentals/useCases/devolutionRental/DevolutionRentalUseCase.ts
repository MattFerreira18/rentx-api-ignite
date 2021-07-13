import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IDateProvider } from '@providers/dateProvider/IDateProvider';

import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { Rental } from '../../infra/database/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

interface IRequest {
  rentalId: string;
  userId: string;
}

@injectable()
export class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ rentalId, userId }: IRequest): Promise<Rental> {
    const minimumDaily = 1;

    const rental = await this.rentalsRepository.findById(rentalId);
    const car = await this.carsRepository.findById(rental.carId);

    if (!rental) {
      throw new AppError({
        statusCode: 404,
        message: 'rental does not exists',
      });
    }

    if (rental.endDate) {
      throw new AppError({
        statusCode: 400,
        message: 'car already returned',
      });
    }

    let daily = this.dateProvider.compareInDays(
      rental.startDate,
      this.dateProvider.dateNow(),
    );

    if (daily <= 0) {
      daily = minimumDaily;
    }

    const delay = this.dateProvider.compareInDays(
      this.dateProvider.dateNow(),
      rental.expectedReturnDate,
    );

    let total = 0;

    if (delay > 0) {
      const calculateFine = delay * car.fineAmount;
      total = calculateFine;
    }

    total += daily * car.dailyRate;

    rental.endDate = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}
