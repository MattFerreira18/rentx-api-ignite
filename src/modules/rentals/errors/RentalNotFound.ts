import { AppError } from '@errors/AppError';

export class RentalNotFound extends AppError {
  constructor() {
    super({ statusCode: 404, message: 'rental not found' });
  }
}
