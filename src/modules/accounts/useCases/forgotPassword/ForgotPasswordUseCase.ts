import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import { IDateProvider } from '@shared/providers/dateProvider/IDateProvider';
import { IEmailProvider } from '@src/shared/providers/emailProvider/IEmailProvider';
import { ITokenProvider } from '@src/shared/providers/tokenProvider/ITokenProvider';

import { UserNotFound } from '../../errors/UserNotFound';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('EmailProvider')
    private emailProvider: IEmailProvider,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,

  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFound();
    }

    const token = this.tokenProvider.createUUIDV4();
    const expiresTokenDate = this.dateProvider.addHours(3);

    await this.usersTokensRepository.create({
      userId: user.id,
      expiresDate: expiresTokenDate,
      refreshToken: token,
    });

    const emailTemplatePath = path.resolve(__dirname, '..', '..', 'views', 'emails', 'forgot-password.hbs');
    const emailVariables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };

    await this.emailProvider.send(user.email, 'forgot password', emailVariables, emailTemplatePath);
  }
}
