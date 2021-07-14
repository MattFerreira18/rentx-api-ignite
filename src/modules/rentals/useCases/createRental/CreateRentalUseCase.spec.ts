import { mock } from 'jest-mock-extended';
import { v4 as uuid } from 'uuid';

import { UsersRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/InMemory/CarsRepositoryInMemory';
import { IDateProvider } from '@providers/dateProvider/IDateProvider';

import { AlreadyRentalInProgress } from '../../errors/AlreadyRentalInProgress';
import { CarNotFound } from '../../errors/CarNotFound';
import { InvalidReturnTime } from '../../errors/InvalidReturnTime';
import { UnavailableCar } from '../../errors/UnavailableCar';
import { RentalsRepositoryInMemory } from '../../repositories/InMemory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';
import { CreateRentalUseCase } from './CreateRentalUseCase';

describe('create rental use case', () => {
  let rentalsRepository: IRentalsRepository;
  let carsRepository: ICarsRepository;
  let usersRepository: IUsersRepository;
  let createRentalUseCase: CreateRentalUseCase;
  let carId: string;
  let userId: string;

  const dateProviderMock = mock<IDateProvider>();

  beforeEach(async () => {
    rentalsRepository = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      carsRepository,
      dateProviderMock,
    );

    await usersRepository.create({
      name: 'Matheus',
      email: 'matheus@email.com',
      driverLicense: '123456',
      password: '123456789',
    });

    await carsRepository.create({
      name: 'name car',
      description: 'description car',
      dailyRate: 100,
      licensePlate: 'ABC-1234',
      fineAmount: 60,
      brand: 'brand',
      categoryId: 'category',
    });

    const user = await usersRepository.findByEmail('matheus@email.com');
    const car = await carsRepository.findAvailable();

    userId = user.id;
    carId = car[0].id;
  });

  it('Should be able to create a new rental', async () => {
    dateProviderMock.compareInHours.mockReturnValue(150);

    await createRentalUseCase.execute({
      userId,
      carId,
      expectedReturnDate: new Date(),
    });

    const rental = await rentalsRepository.findByUserId(userId);

    expect(rental[0]).toHaveProperty('id');
  });

  it('Should not be able to create a rental with unavailable car', async () => {
    await usersRepository.create({
      name: 'Rafael',
      email: 'rafael@email.com',
      driverLicense: '7891048',
      password: '123456789',
    });

    const user = await usersRepository.findByEmail('rafael@email.com');

    await createRentalUseCase.execute({
      userId,
      carId,
      expectedReturnDate: new Date(),
    });

    expect(async () => {
      await createRentalUseCase.execute({
        userId: user.id,
        carId,
        expectedReturnDate: new Date(),
      });
    }).rejects.toBeInstanceOf(UnavailableCar);
  });

  it('Should not be able to create a rental with unavailable user', async () => {
    await createRentalUseCase.execute({
      userId,
      carId,
      expectedReturnDate: new Date(),
    });

    await carsRepository.create({
      name: 'name car 2',
      description: 'description car',
      dailyRate: 100,
      licensePlate: 'CDV-1234',
      fineAmount: 100,
      brand: 'brand2',
      categoryId: 'category2',
    });

    const car = await carsRepository.findAvailableByOptions({ name: 'name car 2' });

    expect(async () => {
      await createRentalUseCase.execute({
        userId,
        carId: car[0].id,
        expectedReturnDate: new Date(),
      });
    }).rejects.toBeInstanceOf(AlreadyRentalInProgress);
  });

  it('Should not create a rental with a nonexisting car', () => {
    expect(async () => {
      await createRentalUseCase.execute({
        userId,
        carId: uuid(),
        expectedReturnDate: new Date(),
      });
    }).rejects.toBeInstanceOf(CarNotFound);
  });

  it('Should not be able to create a rental with invalid date', () => {
    dateProviderMock.compareInHours.mockReturnValue(10);

    expect(async () => {
      await createRentalUseCase.execute({
        userId,
        carId,
        expectedReturnDate: new Date(),
      });
    }).rejects.toBeInstanceOf(InvalidReturnTime);
  });
});
