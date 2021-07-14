import { AppError } from '@errors/AppError';

export class InvalidUser extends AppError {
  constructor() {
    super({ statusCode: 409, message: 'invalid user' });
  }
}
