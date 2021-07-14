import { AppError } from '@errors/AppError';

export class AlreadyRentalInProgress extends AppError {
  constructor() {
    super({
      statusCode: 409,
      message: "there's a rental in progress for user",
    });
  }
}
