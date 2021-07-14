import { AppError } from '@errors/AppError';
import { ICreateSpecificationDTO } from '@src/modules/cars/dtos/ISpecificationDTO';
import { SpecificationsRepositoryInMemory } from '@src/modules/cars/repositories/InMemory/SpecificationsRepositoryInMemory';
import { ISpecificationsRepository } from '@src/modules/cars/repositories/ISpecificationsRepository';

import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

describe('create specification use case', () => {
  let specificationsRepository: ISpecificationsRepository;
  let createSpecificationUseCase: CreateSpecificationUseCase;

  const data: ICreateSpecificationDTO = {
    name: 'wheels',
    description: 'the wheels',
  };

  beforeEach(() => {
    specificationsRepository = new SpecificationsRepositoryInMemory();
    createSpecificationUseCase = new CreateSpecificationUseCase(specificationsRepository);
  });

  it('Should be able to create a specification', async () => {
    await createSpecificationUseCase.execute(data);

    const specification = await specificationsRepository.findByName(data.name);

    expect(specification).toHaveProperty('id');
  });

  it('Should not be able to create a existing specification', async () => {
    await createSpecificationUseCase.execute(data);

    expect(async () => {
      await createSpecificationUseCase.execute(data);
    }).rejects.toBeInstanceOf(AppError);
  });
});
