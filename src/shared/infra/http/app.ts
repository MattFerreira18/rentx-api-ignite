import 'reflect-metadata';
import 'dotenv/config';
import '../../containers';
import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import swagger from 'swagger-ui-express';

import upload from '@configs/upload';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import swaggerConfig from '../../../swagger.json';
import createConnection from '../database';
import { rateLimiter } from './middlewares/rateLimiter';
import { treatmentExceptions } from './middlewares/treatmentExceptions';
import { router } from './routes';

createConnection().then(() => {
  console.log('📦 database was connected with successfully');
});
const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app
  .use(Sentry.Handlers.requestHandler())
  .use(Sentry.Handlers.tracingHandler())
  .use(rateLimiter)
  .use(express.json())
  .use(cors())
  .use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
  .use('/cars', express.static(`${upload.tmpFolder}/cars`))
  .use('/api-docs', swagger.serve, swagger.setup(swaggerConfig))
  .use(router.authenticate)
  .use('/categories', router.categories)
  .use('/specifications', router.specifications)
  .use('/users', router.users)
  .use('/cars', router.cars)
  .use('/rentals', router.rentals)
  .use(Sentry.Handlers.errorHandler())
  .use(treatmentExceptions);

export { app };
