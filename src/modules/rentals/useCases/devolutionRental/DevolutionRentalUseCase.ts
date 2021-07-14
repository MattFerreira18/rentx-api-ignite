import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@providers/dateProvider/IDateProvider';

import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { CarAlreadyReturned } from '../../errors/CarAlreadyReturned';
import { InvalidUser } from '../../errors/InvalidUser';
import { RentalNotFound } from '../../errors/RentalNotFound';
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

    if (!rental) {
      throw new RentalNotFound();
    }

    if (rental.userId !== userId) {
      throw new InvalidUser();
    }

    if (rental.endDate) {
      throw new CarAlreadyReturned();
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

    const car = await this.carsRepository.findById(rental.carId);

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
