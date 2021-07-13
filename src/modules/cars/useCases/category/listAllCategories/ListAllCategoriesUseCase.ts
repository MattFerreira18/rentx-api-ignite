import { inject, injectable } from 'tsyringe';

import Category from '../../../infra/database/entities/Category';
import { ICategoriesRepository } from '../../../repositories/ICategoriesRepository';

@injectable()
class ListAllCategoriesUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(): Promise<Category[]> {
    const categories: Category[] = await this.categoriesRepository.listAll();

    return categories;
  }
}

export { ListAllCategoriesUseCase };
