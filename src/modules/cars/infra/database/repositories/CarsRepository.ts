import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '../../../dtos/ICarDTO';
import { ICarsRepository } from '../../../repositories/ICarsRepository';
import Car from '../entities/Car';

interface IOptions {
  name?: string;
  brand?: string;
  categoryId?: string;
}

export class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    name,
    description,
    brand,
    categoryId,
    dailyRate,
    fineAmount,
    licensePlate,
    available,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      available,
      specifications,
      id,
    });

    await this.repository.save(car);

    return car;
  }

  async findById(id: string): Promise<Car> {
    return this.repository.findOne({ where: { id } });
  }

  async findByLicensePlate(licensePlate: string): Promise<Car> {
    const car = this.repository.findOne({ where: { licensePlate } });

    return car;
  }

  async findAvailable(): Promise<Car[]> {
    return this.repository.find({ where: { available: true } });
  }

  async findAvailableByOptions({
    name,
    brand,
    categoryId,
  }: IOptions): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder('car')
      .where('car.available = :available', { available: true });

    if (brand) {
      carsQuery.andWhere('car.brand = :brand', { brand });
    }

    if (name) {
      carsQuery.andWhere('car.name = :name', { name });
    }

    if (categoryId) {
      carsQuery.andWhere('car.categoryId = :categoryId', { categoryId });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Car)
      .set({ available })
      .where('id = :id', { id })
      .execute();
  }
}
