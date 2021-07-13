import { ICreateCarDTO } from '../../dtos/ICarDTO';
import Car from '../../infra/database/entities/Car';
import { ICarsRepository } from '../ICarsRepository';

interface IOptions {
  name?: string;
  brand?: string;
  categoryId?: string;
}

export class CarsRepositoryInMemory implements ICarsRepository {
  private repository: Car[] = [];

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, data);

    this.repository.push(car);

    return car;
  }

  async findById(id: string): Promise<Car> {
    return this.repository.find((car) => car.id === id);
  }

  async findByLicensePlate(licensePlate: string): Promise<Car> {
    return this.repository.find((car) => car.licensePlate === licensePlate);
  }

  async findAvailable(): Promise<Car[]> {
    return this.repository.filter((car) => car.available === true);
  }

  async findAvailableByOptions({
    name,
    brand,
    categoryId,
  }: IOptions): Promise<Car[]> {
    const availableCars = this.repository.filter((car) => {
      if (
        car.available === true
        && ((name && car.name === name)
          || (brand && car.brand === brand)
          || (categoryId && car.categoryId === categoryId))
      ) {
        return car;
      }

      return null;
    });

    return availableCars;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const carIndex = this.repository.findIndex((car) => car.id === id);

    this.repository[carIndex].available = available;
  }
}
