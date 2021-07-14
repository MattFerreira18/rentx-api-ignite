import { AppError } from '@errors/AppError';

export class CarAlreadyExists extends AppError {
  constructor() {
    super({ statusCode: 400, message: 'car already exists' });
  }
}
