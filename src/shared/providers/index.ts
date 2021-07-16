import { container } from 'tsyringe';

import { IDateProvider } from './dateProvider/IDateProvider';
import { DateProvider } from './dateProvider/implementations/DateProvider';
import { EmailProvider } from './emailProvider/EmailProvider';
import { IEmailProvider } from './emailProvider/IEmailProvider';
import { EncryptsProvider } from './encryptsProviders/EncryptsProvider';
import { IEncryptsProvider } from './encryptsProviders/IEncryptsProvider';
import { ITokenProvider } from './tokenProvider/ITokenProvider';
import { TokenProvider } from './tokenProvider/TokenProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateProvider);

container.registerSingleton<ITokenProvider>('TokenProvider', TokenProvider);

container.registerSingleton<IEncryptsProvider>('EncryptsProvider', EncryptsProvider);

container.registerInstance<IEmailProvider>('EmailProvider', new EmailProvider());
