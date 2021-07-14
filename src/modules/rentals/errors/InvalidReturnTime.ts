import { AppError } from '@errors/AppError';

export class InvalidReturnTime extends AppError {
  constructor() {
    super({ statusCode: 400, message: 'invalid return time' });
  }
}
