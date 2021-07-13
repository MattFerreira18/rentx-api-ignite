import dayjs from 'dayjs';
import { mock } from 'jest-mock-extended';

import { AppError } from '@errors/AppError';
import { IDateProvider } from '@providers/dateProvider/IDateProvider';

import { CarsRepository } from '../../../cars/infra/database/repositories/CarsRepository';
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { RentalsRepositoryInMemory } from '../../repositories/InMemory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';
import { CreateRentalUseCase } from './CreateRentalUseCase';

describe('create rental', () => {
  let rentalsRepository: IRentalsRepository;
  let createRentalUseCase: CreateRentalUseCase;
  let carsRepository: ICarsRepository;
  let carId: string;

  const add24Hours = dayjs().add(1, 'day').toDate();

  const dayJsProvider = mock<IDateProvider>();

  beforeEach(async () => {
    console.log('test1');
    rentalsRepository = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepository();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      dayJsProvider,
      carsRepository,
    );

    console.log('test2');
    await carsRepository.create({
      name: 'name car',
      description: 'description car',
      dailyRate: 100,
      licensePlate: 'ABC-1234',
      fineAmount: 60,
      brand: 'brand',
      categoryId: 'category',
    });

    const car = await carsRepository.findByLicensePlate('ABC-1234');

    carId = car.id;
  });

  it.only('Should be able to rental a existing car', async () => {
    console.log(carId);
    const rental = await createRentalUseCase.execute({
      userId: '123',
      carId,
      expectedReturnDate: add24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('startDate');
  });

  it("Should not be able to rental a car if there's another open to the same car", async () => {
    await createRentalUseCase.execute({
      userId: '123',
      carId,
      expectedReturnDate: add24Hours,
    });

    expect(async () => {
      await createRentalUseCase.execute({
        userId: '456',
        carId,
        expectedReturnDate: add24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should update car availability', async () => {
    await createRentalUseCase.execute({
      userId: '123',
      carId,
      expectedReturnDate: add24Hours,
    });

    const car = await carsRepository.findById(carId);

    expect(car.available).toBe(false);
  });

  it("Should not be able to rental a car if there's another open to the same user", async () => {
    await createRentalUseCase.execute({
      userId: '123',
      carId,
      expectedReturnDate: add24Hours,
    });

    expect(async () => {
      await createRentalUseCase.execute({
        userId: '123',
        carId: '456',
        expectedReturnDate: add24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to rental a existing car with invalid return time', () => {
    expect(async () => {
      await createRentalUseCase.execute({
        userId: '123',
        carId,
        expectedReturnDate: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
