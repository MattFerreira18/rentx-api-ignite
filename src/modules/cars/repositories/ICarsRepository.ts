import { ICreateCarDTO } from '../dtos/ICarDTO';
import Car from '../infra/database/entities/Car';

interface IOptions {
  name?: string;
  brand?: string;
  categoryId?: string;
}

export interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(licensePlate: string): Promise<Car>;
  findAvailable(): Promise<Car[]>;
  findById(id: string): Promise<Car>;
  findAvailableByOptions({ name, brand, categoryId }: IOptions): Promise<Car[]>;
  updateAvailable(id: string, available: boolean): Promise<void>;
}
