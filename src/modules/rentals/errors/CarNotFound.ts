import { AppError } from '@errors/AppError';

export class CarNotFound extends AppError {
  constructor() {
    super({ statusCode: 404, message: 'car not found' });
  }
}
