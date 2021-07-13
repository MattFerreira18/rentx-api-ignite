import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '../../../dtos/IRentalDTO';
import { IRentalsRepository } from '../../../repositories/IRentalsRepository';
import { Rental } from '../entities/Rental';

export class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    carId,
    userId,
    expectedReturnDate,
    id,
    endDate,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const car = this.repository.create({
      carId,
      userId,
      expectedReturnDate,
      id,
      endDate,
      total,
    });

    await this.repository.save(car);

    return car;
  }

  async findOpenRentalByCarId(carId: string): Promise<Rental> {
    return this.repository.findOne({
      where: { carId, endDate: null },
    });
  }

  async findOpenRentalByUserId(userId: string): Promise<Rental> {
    return this.repository.findOne({
      where: { userId, endDate: null },
    });
  }

  async findById(id: string): Promise<Rental> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Rental[]> {
    return this.repository
      .createQueryBuilder('rental')
      .where('rental.user_id = :userId', { userId })
      .leftJoinAndSelect('rental.car', 'car')
      .getMany();
  }
}
