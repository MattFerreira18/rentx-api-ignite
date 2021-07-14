import { AppError } from '@errors/AppError';

export class CarAlreadyReturned extends AppError {
  constructor() {
    super({ statusCode: 400, message: 'car already returned' });
  }
}
