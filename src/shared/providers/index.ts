import { container } from 'tsyringe';

import { IDateProvider } from './dateProvider/IDateProvider';
import { DateProvider } from './dateProvider/implementations/DateProvider';
import { EmailProvider } from './emailProvider/EmailProvider';
import { IEmailProvider } from './emailProvider/IEmailProvider';
import { LocalEmailProvider } from './emailProvider/LocalEmailProvider';
import { EncryptsProvider } from './encryptsProviders/EncryptsProvider';
import { IEncryptsProvider } from './encryptsProviders/IEncryptsProvider';
import { LocalStorageProvider } from './StorageProvider/implementations/LocalStorageProvider';
import { StorageProvider } from './StorageProvider/implementations/StorageProvider';
import { IStorageProvider } from './StorageProvider/IStorageProvider';
import { ITokenProvider } from './tokenProvider/ITokenProvider';
import { TokenProvider } from './tokenProvider/TokenProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateProvider);

container.registerSingleton<ITokenProvider>('TokenProvider', TokenProvider);

container.registerSingleton<IEncryptsProvider>('EncryptsProvider', EncryptsProvider);

const mailProvider = {
  ses: container.resolve(EmailProvider),
  ethereal: container.resolve(LocalEmailProvider),
};

container.registerInstance<IEmailProvider>('EmailProvider', mailProvider[process.env.MAIL_PROVIDER]);

const diskStorage = {
  local: LocalStorageProvider,
  S3: StorageProvider,
};

container.registerSingleton<IStorageProvider>('StorageProvider', diskStorage[process.env.DISK]);
