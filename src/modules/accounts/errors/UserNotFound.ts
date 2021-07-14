import { AppError } from '@errors/AppError';

export class UserNotFound extends AppError {
  constructor() {
    super({ statusCode: 404, message: 'user not found' });
  }
}
