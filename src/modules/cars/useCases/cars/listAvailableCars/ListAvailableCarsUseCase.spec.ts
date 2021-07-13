import { ICreateCarDTO } from '../../../dtos/ICarDTO';
import { ICarsRepository } from '../../../repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '../../../repositories/InMemory/CarsRepositoryInMemory';
import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

describe('list cars', () => {
  let carsRepository: ICarsRepository;
  let createCarUseCase: CreateCarUseCase;
  let listAvailableCarsUseCase: ListAvailableCarsUseCase;

  const data: ICreateCarDTO[] = [
    {
      name: 'name car',
      description: 'description car',
      dailyRate: 100,
      licensePlate: 'ABCDE-1234',
      fineAmount: 60,
      brand: 'brand',
      categoryId: '018aac72-4db3-4979-b493-b7071521ced6',
    },
    {
      name: 'name car 2',
      description: 'description car 2',
      dailyRate: 150,
      licensePlate: 'ABC-123',
      fineAmount: 250,
      brand: 'brand',
      categoryId: '018aac72-4db3-4979-b493-b7071521ced6',
    },
    {
      name: 'name car 3',
      description: 'description car 3',
      dailyRate: 150,
      licensePlate: 'ACD-123',
      fineAmount: 50,
      brand: 'brand 3',
      available: false,
      categoryId: '018aac72-4db3-4979-b493-b7071521ced6',
    },
  ];

  beforeEach(async () => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);

    await createCarUseCase.execute(data[0]);
    await createCarUseCase.execute(data[1]);
    await createCarUseCase.execute(data[2]);
  });

  it('Should be able to list all available cars', async () => {
    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toHaveLength(2);
  });

  it('Should be able all available cars by name', async () => {
    const cars = await listAvailableCarsUseCase.execute({
      name: 'name car 2',
    });

    expect(cars).toHaveLength(1);
  });

  it('Should be able to list all available cars by brand', async () => {
    const cars = await listAvailableCarsUseCase.execute({
      brand: 'brand',
    });

    expect(cars).toHaveLength(2);
  });

  it('Should be able all available cars by categoryId', async () => {
    const cars = await listAvailableCarsUseCase.execute({
      categoryId: '018aac72-4db3-4979-b493-b7071521ced6',
    });

    expect(cars).toHaveLength(2);
  });
});
