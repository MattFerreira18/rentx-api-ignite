import { inject, injectable } from 'tsyringe';

import { CarNotFound } from '@src/modules/cars/errors/CarNotFound';
import { SpecificationNotSended } from '@src/modules/cars/errors/SpecificationNotSended';

import { ICarsRepository } from '../../../repositories/ICarsRepository';
import { ISpecificationsRepository } from '../../../repositories/ISpecificationsRepository';

interface IRequest {
  carId: string;
  specificationsId: string[];
}

@injectable()
export class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute({ carId, specificationsId }: IRequest): Promise<void> {
    const carExists = await this.carsRepository.findById(carId);

    if (!carExists) {
      throw new CarNotFound();
    }

    if (specificationsId.length === 0) {
      throw new SpecificationNotSended();
    }

    const specifications = await this.specificationsRepository.findByIds(
      specificationsId,
    );

    carExists.specifications = specifications;

    await this.carsRepository.create(carExists);
  }
}
