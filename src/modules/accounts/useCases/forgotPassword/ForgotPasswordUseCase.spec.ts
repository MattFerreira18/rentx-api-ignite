import crypto from 'crypto';
import { mock } from 'jest-mock-extended';
import path from 'path';

import { IDateProvider } from '@src/shared/providers/dateProvider/IDateProvider';
import { IEmailProvider } from '@src/shared/providers/emailProvider/IEmailProvider';
import { ITokenProvider } from '@src/shared/providers/tokenProvider/ITokenProvider';

import { UserNotFound } from '../../errors/UserNotFound';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '../../repositories/inMemory/UsersTokensRepositoryImMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';
import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

describe('forgot password use case', () => {
  let usersRepository: IUsersRepository;
  let usersTokensRepository: IUsersTokensRepository;
  let forgotPasswordUseCase: ForgotPasswordUseCase;
  let userId: string;

  const dateProviderMock = mock<IDateProvider>();
  const emailProviderMock = mock<IEmailProvider>();
  const tokenProviderMock = mock<ITokenProvider>();

  const data = {
    name: 'Harry Griffin',
    email: 'harry@email.com',
    driverLicense: '399818336944',
    password: '87253346',
  };

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    forgotPasswordUseCase = new ForgotPasswordUseCase(
      usersRepository,
      usersTokensRepository,
      emailProviderMock,
      dateProviderMock,
      tokenProviderMock,
    );

    await usersRepository.create(data);

    const user = await usersRepository.findByEmail(data.email);

    userId = user.id;
  });

  it('Should be able to send the forgot password mail to user', async () => {
    const token = crypto.randomBytes(12).toString('utf8');
    const expiresDate = new Date();

    dateProviderMock.addHours.mockReturnValue(expiresDate);
    tokenProviderMock.createUUIDV4.mockReturnValue(token);

    await forgotPasswordUseCase.execute(data.email);

    const tokenToResetPassword = await usersTokensRepository.findByToken(token);

    expect(tokenToResetPassword).toHaveProperty('id');
    expect(tokenToResetPassword.expiresDate).toEqual(expiresDate);
    expect(tokenToResetPassword.refreshToken).toEqual(token);
    expect(tokenToResetPassword.userId).toEqual(userId);
  });

  it('Should be call date provider with correct values', async () => {
    const token = crypto.randomBytes(12).toString('utf8');

    dateProviderMock.addHours.mockReturnValue(new Date());
    tokenProviderMock.createUUIDV4.mockReturnValue(token);

    await forgotPasswordUseCase.execute(data.email);

    expect(dateProviderMock.addHours).toBeCalledTimes(1);
    expect(dateProviderMock.addHours).toBeCalledWith(3);
  });

  it('Should be call email provider with correct values', async () => {
    const token = crypto.randomBytes(12).toString('utf8');

    dateProviderMock.addHours.mockReturnValue(new Date());
    tokenProviderMock.createUUIDV4.mockReturnValue(token);

    await forgotPasswordUseCase.execute(data.email);

    expect(emailProviderMock.send).toBeCalledTimes(1);
    expect(emailProviderMock.send).toBeCalledWith(
      data.email,
      'forgot password',
      { name: data.name, link: `${process.env.FORGOT_MAIL_URL}${token}` },
      path.resolve(__dirname, '..', '..', 'views', 'emails', 'forgot-password.hbs'),
    );
  });

  it('Should be call token provider only one time', async () => {
    const token = crypto.randomBytes(12).toString('utf8');

    dateProviderMock.addHours.mockReturnValue(new Date());
    tokenProviderMock.createUUIDV4.mockReturnValue(token);

    await forgotPasswordUseCase.execute(data.email);

    expect(tokenProviderMock.createUUIDV4).toBeCalledTimes(1);
  });

  it('Should not be able to send the forgot password mail to user', () => {
    expect(async () => {
      await forgotPasswordUseCase.execute('email@email.com');
    }).rejects.toBeInstanceOf(UserNotFound);
  });
});
