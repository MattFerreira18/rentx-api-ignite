import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

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

    if (!name || !description) {
      throw new AppError({
        statusCode: 400,
        message: 'name or description undefined',
      });
    }

    if (categoryAlreadyExists) {
      throw new AppError({
        statusCode: 409,
        message: 'category already exists',
      });
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
