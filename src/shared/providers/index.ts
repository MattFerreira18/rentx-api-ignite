import { container } from 'tsyringe';

import { IDateProvider } from './dateProvider/IDateProvider';
import { DateProvider } from './dateProvider/implementations/DateProvider';
import { ITokenProvider } from './tokenProvider/ITokenProvider';
import { TokenProvider } from './tokenProvider/TokenProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateProvider);

container.registerSingleton<ITokenProvider>('TokenProvider', TokenProvider);
