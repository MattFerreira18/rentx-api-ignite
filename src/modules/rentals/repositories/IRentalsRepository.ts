import { ICreateRentalDTO } from '../dtos/IRentalDTO';
import { Rental } from '../infra/database/entities/Rental';

export interface IRentalsRepository {
  create({
    userId,
    carId,
    expectedReturnDate,
    id,
    endDate,
  }: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByCarId(carId: string): Promise<Rental>;
  findOpenRentalByUserId(userId: string): Promise<Rental>;
  findById(id: string): Promise<Rental>;
  findByUserId(userId: string): Promise<Rental[]>;
}
