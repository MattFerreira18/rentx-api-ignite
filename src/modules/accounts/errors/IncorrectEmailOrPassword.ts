import { AppError } from '@errors/AppError';

export class IncorrectEmailOrPassword extends AppError {
  constructor() {
    super({ statusCode: 403, message: 'incorrect email or password' });
  }
}
