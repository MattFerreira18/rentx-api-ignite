import { ICreateCategoryDTO } from '../dtos/ICategoryDTO';
import Category from '../infra/database/entities/Category';

interface ICategoriesRepository {
  create({ name, description }: ICreateCategoryDTO): Promise<void>;
  findByName(name: string): Promise<Category>;
  listAll(): Promise<Category[]>;
}

export { ICategoriesRepository };
