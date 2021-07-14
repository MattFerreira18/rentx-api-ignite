import { v4 as uuid } from 'uuid';

import { CarNotFound } from '@src/modules/cars/errors/CarNotFound';
import { SpecificationNotSended } from '@src/modules/cars/errors/SpecificationNotSended';

import { ICreateCarDTO } from '../../../dtos/ICarDTO';
import { ICarsRepository } from '../../../repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '../../../repositories/InMemory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '../../../repositories/InMemory/SpecificationsRepositoryInMemory';
import { ISpecificationsRepository } from '../../../repositories/ISpecificationsRepository';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

describe('create car specification', () => {
  let carsRepository: ICarsRepository;
  let specificationsRepository: ISpecificationsRepository;
  let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
  let carId: string;
  let specificationId: string;

  const data: ICreateCarDTO = {
    name: 'name car',
    description: 'description car',
    dailyRate: 100,
    licensePlate: 'ABC-1234',
    fineAmount: 60,
    brand: 'brand',
    categoryId: 'category',
  };

  beforeEach(async () => {
    carsRepository = new CarsRepositoryInMemory();
    specificationsRepository = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepository,
      specificationsRepository,
    );

    await carsRepository.create(data);

    await specificationsRepository.create({
      name: 'specification',
      description: 'a description',
    });

    const car = await carsRepository.findAvailableByOptions({
      name: data.name,
    });

    const specification = await specificationsRepository.findByName(
      'specification',
    );

    carId = car[0].id;
    specificationId = specification.id;
  });

  it('Should be able to add a new car specification with a existent car and with existents specifications', async () => {
    await createCarSpecificationUseCase.execute({
      carId,
      specificationsId: [specificationId],
    });
  });

  it('Should not be able to add a new car specification if carId not exists', () => {
    expect(async () => {
      await createCarSpecificationUseCase.execute({
        carId: uuid(),
        specificationsId: [specificationId],
      });
    }).rejects.toBeInstanceOf(CarNotFound);
  });

  it('Should not be able to add a new car specification with a empty specificationsId', () => {
    expect(async () => {
      await createCarSpecificationUseCase.execute({
        carId,
        specificationsId: [],
      });
    }).rejects.toBeInstanceOf(SpecificationNotSended);
  });
});
