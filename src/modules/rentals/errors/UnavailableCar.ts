import { AppError } from '@errors/AppError';

export class UnavailableCar extends AppError {
  constructor() {
    super({ statusCode: 409, message: 'car is unavailable' });
  }
}
