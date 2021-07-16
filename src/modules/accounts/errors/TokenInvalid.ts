import { AppError } from '@errors/AppError';

export class TokenInvalid extends AppError {
  constructor() {
    super({ statusCode: 409, message: 'token invalid' });
  }
}
