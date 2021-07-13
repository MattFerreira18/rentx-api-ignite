import { Request, Response } from 'express';
import { container } from 'tsyringe';

import Category from '../../../infra/database/entities/Category';
import { ListAllCategoriesUseCase } from './ListAllCategoriesUseCase';

class ListAllCategoriesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const listAllCategoriesUseCase = container.resolve(
      ListAllCategoriesUseCase,
    );

    const categories: Category[] = await listAllCategoriesUseCase.execute();

    return res.status(200).json(categories);
  }
}

export { ListAllCategoriesController };
