import { inject, injectable } from 'tsyringe';

import Car from '../../../infra/database/entities/Car';
import { ICarsRepository } from '../../../repositories/ICarsRepository';

interface IRequest {
  name?: string;
  brand?: string;
  categoryId?: string;
}

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ name, brand, categoryId }: IRequest): Promise<Car[]> {
    let cars: Car[];

    if (name || brand || categoryId) {
      cars = await this.carsRepository.findAvailableByOptions({
        name,
        brand,
        categoryId,
      });
    } else {
      cars = await this.carsRepository.findAvailable();
    }

    return cars;
  }
}
