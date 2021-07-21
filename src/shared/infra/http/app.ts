import 'dotenv/config';
import 'reflect-metadata';
import '../../containers';
import 'express-async-errors';

import express from 'express';
import swagger from 'swagger-ui-express';

import upload from '@configs/upload';

import swaggerConfig from '../../../swagger.json';
// import '../database';
import createConnection from '../database';
import { treatmentExceptions } from './middlewares/treatmentExceptions';
import { router } from './routes';

createConnection().then(() => {
  console.log('📦 database was connected with successfully');
});
const app = express();

app
  .use(express.json())
  .use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
  .use('/cars', express.static(`${upload.tmpFolder}/cars`))
  .use('/api-docs', swagger.serve, swagger.setup(swaggerConfig))
  .use(router.authenticate)
  .use('/categories', router.categories)
  .use('/specifications', router.specifications)
  .use('/users', router.users)
  .use('/cars', router.cars)
  .use('/rentals', router.rentals)
  .use(treatmentExceptions);

export { app };
