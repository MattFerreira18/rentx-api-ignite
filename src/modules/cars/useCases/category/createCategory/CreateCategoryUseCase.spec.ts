import { CategoryAlreadyExists } from '@src/modules/cars/errors/CategoryAlreadyExists';

import { ICreateCategoryDTO } from '../../../dtos/ICategoryDTO';
import { ICategoriesRepository } from '../../../repositories/ICategoriesRepository';
import { CategoriesRepositoryInMemory } from '../../../repositories/InMemory/CategoriesRepositoryInMemory';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

describe('Create Category', () => {
  let createCategoryUseCase: CreateCategoryUseCase;
  let categoriesRepositoryInMemory: ICategoriesRepository;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    );
  });

  it('Should be able to create a new category', async () => {
    const category: ICreateCategoryDTO = {
      name: 'category test',
      description: 'a example of category description',
    };

    await createCategoryUseCase.execute(category);

    const categoryCreated = await categoriesRepositoryInMemory.findByName(
      category.name,
    );

    expect(categoryCreated).toHaveProperty('id');
  });

  it('Should not be able to create a duplicated category', async () => {
    const category: ICreateCategoryDTO = {
      name: 'category test',
      description: 'a example of category description',
    };

    await createCategoryUseCase.execute(category);

    expect(async () => {
      await createCategoryUseCase.execute(category);
    }).rejects.toBeInstanceOf(CategoryAlreadyExists);
  });
});
