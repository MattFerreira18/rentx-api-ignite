import { Router } from 'express';

import authenticate from './authenticate.routes';
import cars from './cars.routes';
import categories from './categories.routes';
import rentals from './rental.routes';
import specifications from './specifications.routes';
import users from './users.routes';

const router = Router();

router
  .use(authenticate)
  .use('/categories', categories)
  .use('/specifications', specifications)
  .use('/users', users)
  .use('/cars', cars)
  .use('/rentals', rentals);

export default router;
