import { v4 as uuid } from 'uuid';

import { RentalsRepositoryInMemory } from '../../repositories/InMemory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';
import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

describe('list rentals by user', () => {
  let rentalsRepository: IRentalsRepository;
  let listRentalsByUserUseCase: ListRentalsByUserUseCase;

  const userId = uuid();

  beforeEach(async () => {
    rentalsRepository = new RentalsRepositoryInMemory();
    listRentalsByUserUseCase = new ListRentalsByUserUseCase(rentalsRepository);

    rentalsRepository.create({
      carId: uuid(),
      userId: uuid(),
      expectedReturnDate: new Date(),
    });

    rentalsRepository.create({
      carId: uuid(),
      userId,
      expectedReturnDate: new Date(),
    });

    rentalsRepository.create({
      carId: uuid(),
      userId,
      expectedReturnDate: new Date(),
    });

    rentalsRepository.create({
      carId: uuid(),
      userId,
      expectedReturnDate: new Date(),
    });
  });

  it('Should be able to list all rentals of a user', async () => {
    const rentals = await listRentalsByUserUseCase.execute(userId);

    expect(rentals).toHaveLength(3);
  });
});
