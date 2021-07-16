import { AppError } from '@errors/AppError';

export class TokenExpired extends AppError {
  constructor() {
    super({ statusCode: 409, message: 'token expired' });
  }
}
