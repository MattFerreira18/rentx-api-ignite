import { AppError } from '@errors/AppError';

export class UserAlreadyExists extends AppError {
  constructor() {
    super({ statusCode: 400, message: 'user already exists' });
  }
}
