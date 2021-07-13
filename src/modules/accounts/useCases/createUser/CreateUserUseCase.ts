import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IEncryptsProvider } from '@providers/encryptsProviders/IEncryptsProvider';

import { ICreateUserDTO } from '../../dtos/IUserDTO';
import { IUsersRepository } from '../../repositories/IUsersRepository';

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('EncryptsProvider')
    private encryptsProvider: IEncryptsProvider,
  ) {}

  async execute({
    name,
    email,
    driverLicense,
    password,
  }: ICreateUserDTO): Promise<void> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new AppError({ statusCode: 409, message: 'user already exists' });
    }

    const passwordHash = await this.encryptsProvider.hash(password);

    await this.usersRepository.create({
      name,
      email,
      driverLicense,
      password: passwordHash,
    });
  }
}

export { CreateUserUseCase };
