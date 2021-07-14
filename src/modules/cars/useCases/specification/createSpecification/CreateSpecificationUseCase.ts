import { inject, injectable } from 'tsyringe';

import { SpecificationAlreadyExists } from '@src/modules/cars/errors/SpecificationAlreadyExists';

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
      throw new SpecificationAlreadyExists();
    }

    await this.specificationRepository.create({ name, description });
  }
}

export { CreateSpecificationUseCase };
