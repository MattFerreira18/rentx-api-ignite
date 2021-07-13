import { inject, injectable } from 'tsyringe';

import { Rental } from '../../infra/database/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

@injectable()
export class ListRentalsByUserUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
  ) {}

  async execute(userId: string): Promise<Rental[]> {
    const rentals = await this.rentalsRepository.findByUserId(userId);

    return rentals;
  }
}
