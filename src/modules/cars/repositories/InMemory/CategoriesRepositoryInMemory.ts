import { ICreateCategoryDTO } from '../../dtos/ICategoryDTO';
import Category from '../../infra/database/entities/Category';
import { ICategoriesRepository } from '../ICategoriesRepository';

class CategoriesRepositoryInMemory implements ICategoriesRepository {
  private repository: Category[];

  constructor() {
    this.repository = [];
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = new Category();

    Object.assign(category, { name, description });

    this.repository.push(category);
  }
  async findByName(name: string): Promise<Category> {
    return this.repository.find((ctg) => ctg.name === name);
  }
  async listAll(): Promise<Category[]> {
    return this.repository;
  }
}

export { CategoriesRepositoryInMemory };
