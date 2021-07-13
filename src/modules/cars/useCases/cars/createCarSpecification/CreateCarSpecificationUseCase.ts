import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

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
      throw new AppError({ statusCode: 404, message: 'car does not exits' });
    }

    if (specificationsId.length === 0) {
      throw new AppError({
        statusCode: 404,
        message: 'specifications id not sended',
      });
    }

    const specifications = await this.specificationsRepository.findByIds(
      specificationsId,
    );

    carExists.specifications = specifications;

    await this.carsRepository.create(carExists);
  }
}
