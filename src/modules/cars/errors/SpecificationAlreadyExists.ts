import { AppError } from '@errors/AppError';

export class SpecificationAlreadyExists extends AppError {
  constructor() {
    super({ statusCode: 400, message: 'specification already exists' });
  }
}
