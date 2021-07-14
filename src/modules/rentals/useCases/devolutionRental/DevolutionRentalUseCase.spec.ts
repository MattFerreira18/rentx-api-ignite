import { mock } from 'jest-mock-extended';
import { v4 as uuid } from 'uuid';

import { ICarsRepository } from '@src/modules/cars/repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '@src/modules/cars/repositories/InMemory/CarsRepositoryInMemory';
import { AppError } from '@src/shared/errors/AppError';
import { IDateProvider } from '@src/shared/providers/dateProvider/IDateProvider';

import { RentalsRepositoryInMemory } from '../../repositories/InMemory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

describe('devolution rental use case', () => {
  let rentalsRepository: IRentalsRepository;
  let carsRepository: ICarsRepository;
  let devolutionRentalUseCase: DevolutionRentalUseCase;
  let rentalId: string;
  let expectedReturnDate: Date;

  const userId = uuid();
  const dateProviderMock = mock<IDateProvider>();

  beforeEach(async () => {
    rentalsRepository = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    devolutionRentalUseCase = new DevolutionRentalUseCase(
      rentalsRepository,
      carsRepository,
      dateProviderMock,
    );

    carsRepository.create({
      name: 'name car',
      description: 'description car',
      dailyRate: 100,
      licensePlate: 'ABC-1234',
      fineAmount: 60,
      brand: 'brand',
      categoryId: 'category',
    });

    const car = await carsRepository.findAvailable();

    expectedReturnDate = new Date();

    rentalsRepository.create({
      carId: car[0].id,
      userId,
      expectedReturnDate,
    });

    const rental = await rentalsRepository.findByUserId(userId);

    rentalId = rental[0].id;
  });

  it('Should be able to realize the devolution of a rental', async () => {
    dateProviderMock.compareInDays.mockReturnValue(1);

    await devolutionRentalUseCase.execute({ rentalId, userId });

    const rental = await rentalsRepository.findById(rentalId);

    expect(rental.endDate).not.toBeNull();
    expect(rental.total).not.toBeNull();
  });

  it('Should be able to return the total of a 1 day', async () => {
    const date = new Date();

    dateProviderMock.compareInDays.mockReturnValue(1);
    dateProviderMock.dateNow.mockReturnValue(date);

    await devolutionRentalUseCase.execute({ rentalId, userId });

    const rental = await rentalsRepository.findById(rentalId);

    expect(rental.total).toEqual(160);
  });

  it('Should be able to return the total of a 3 days', async () => {
    const date = new Date();

    dateProviderMock.compareInDays.mockReturnValue(3);
    dateProviderMock.dateNow.mockReturnValue(date);

    await devolutionRentalUseCase.execute({ rentalId, userId });

    const rental = await rentalsRepository.findById(rentalId);

    expect(rental.total).toEqual(480);
  });

  it('Should be call date provider with correct values', async () => {
    const date = new Date();

    dateProviderMock.compareInDays.mockReturnValue(1);
    dateProviderMock.dateNow.mockReturnValue(date);

    await devolutionRentalUseCase.execute({ rentalId, userId });

    expect(dateProviderMock.compareInDays).toBeCalledTimes(2);
    expect(dateProviderMock.compareInDays).toBeCalledWith(date, expectedReturnDate);
  });

  it('Should not be able to realize the devolution of car already returned', async () => {
    dateProviderMock.compareInDays.mockReturnValue(1);

    await devolutionRentalUseCase.execute({ rentalId, userId });

    expect(async () => {
      await devolutionRentalUseCase.execute({ rentalId, userId });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to realize the devolution with a nonexisting rental', () => {
    expect(async () => {
      await devolutionRentalUseCase.execute({ rentalId: uuid(), userId });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to realize the devolution of a rental with a another user', () => {
    expect(async () => {
      await devolutionRentalUseCase.execute({ rentalId, userId: uuid() });
    }).rejects.toBeInstanceOf(AppError);
  });
});
