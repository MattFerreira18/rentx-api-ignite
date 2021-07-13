import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { ICreateSpecificationDTO } from '../../../dtos/ISpecificationDTO';
import { ISpecificationsRepository } from '../../../repositories/ISpecificationsRepository';

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationRepository: ISpecificationsRepository,
  ) {}

  async execute({ name, description }: ICreateSpecificationDTO): Promise<void> {
    const specificationAlreadyExists = await this.specificationRepository.findByName(name);

    if (specificationAlreadyExists) {
      throw new AppError({
        statusCode: 409,
        message: 'specification already exists',
      });
    }

    await this.specificationRepository.create({ name, description });
  }
}

export { CreateSpecificationUseCase };