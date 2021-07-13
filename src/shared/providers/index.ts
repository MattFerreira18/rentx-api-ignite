import { container } from 'tsyringe';

import { IDateProvider } from './dateProvider/IDateProvider';
import { DateProvider } from './dateProvider/implementations/DateProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateProvider);
