import { AppError } from '@errors/AppError';

export class SpecificationNotSended extends AppError {
  constructor() {
    super({ statusCode: 404, message: 'specifications id not sended' });
  }
}
