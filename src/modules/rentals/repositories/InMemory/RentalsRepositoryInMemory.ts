import { ICreateRentalDTO } from '../../dtos/IRentalDTO';
import { Rental } from '../../infra/database/entities/Rental';
import { IRentalsRepository } from '../IRentalsRepository';

export class RentalsRepositoryInMemory implements IRentalsRepository {
  private repository: Rental[] = [];

  async create({
    userId,
    carId,
    expectedReturnDate,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      userId,
      carId,
      expectedReturnDate,
      startDate: new Date(),
    });

    this.repository.push(rental);

    return rental;
  }
  async findOpenRentalByCarId(carId: string): Promise<Rental> {
    return this.repository.find(
      (rental) => rental.carId === carId && !rental.endDate,
    );
  }

  async findByUserId(userId: string): Promise<Rental[]> {
    return this.repository.filter((rental) => rental.userId === userId);
  }

  async findOpenRentalByUserId(userId: string): Promise<Rental> {
    return this.repository.find(
      (rental) => rental.userId === userId && !rental.endDate,
    );
  }

  async findById(id: string): Promise<Rental> {
    return this.repository.find((rental) => rental.id === id);
  }
}
