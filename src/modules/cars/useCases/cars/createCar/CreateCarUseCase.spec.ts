import { AppError } from '@errors/AppError';

import { ICarsRepository } from '../../../repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '../../../repositories/InMemory/CarsRepositoryInMemory';
import { CreateCarUseCase } from './CreateCarUseCase';

describe('create car', () => {
  let carsRepository: ICarsRepository;
  let createCarUseCase: CreateCarUseCase;

  const data = {
    name: 'name car',
    description: 'description car',
    dailyRate: 100,
    licensePlate: 'ABC-1234',
    fineAmount: 60,
    brand: 'brand',
    categoryId: 'category',
  };

  const data2 = {
    name: 'name car 2',
    description: 'description car 2',
    dailyRate: 110,
    licensePlate: 'ABC-1234',
    fineAmount: 100,
    brand: 'brand 2',
    categoryId: 'category 2',
  };

  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it('Should be able to create a new car', async () => {
    const car = await createCarUseCase.execute(data);

    expect(car).toHaveProperty('id');
  });

  it('Should not be able to create a if your licensePlate already used', async () => {
    await createCarUseCase.execute(data);

    expect(async () => {
      await createCarUseCase.execute(data2);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to create a new car with available true by default', async () => {
    const car = await createCarUseCase.execute(data);

    expect(car.available).toBe(true);
  });
});
