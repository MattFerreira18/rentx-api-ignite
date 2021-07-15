import { AppError } from '@errors/AppError';

export class RefreshTokenNotFound extends AppError {
  constructor() {
    super({ statusCode: 404, message: 'refresh token not found' });
  }
}
