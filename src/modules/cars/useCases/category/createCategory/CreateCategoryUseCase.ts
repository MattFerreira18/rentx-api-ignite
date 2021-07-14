import { inject, injectable } from 'tsyringe';

import { CategoryAlreadyExists } from '@src/modules/cars/errors/CategoryAlreadyExists';

import { ICreateCategoryDTO } from '../../../dtos/ICategoryDTO';
import { ICategoriesRepository } from '../../../repositories/ICategoriesRepository';

@injectable() // dependency inject
class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ name, description }: ICreateCategoryDTO): Promise<void> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name,
    );

    if (categoryAlreadyExists) {
      throw new CategoryAlreadyExists();
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
