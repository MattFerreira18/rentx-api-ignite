import { AppError } from '@errors/AppError';

export class CategoryAlreadyExists extends AppError {
  constructor() {
    super({ statusCode: 400, message: 'category already exists' });
  }
}
