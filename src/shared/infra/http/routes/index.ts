import authenticate from './authenticate.routes';
import cars from './cars.routes';
import categories from './categories.routes';
import rentals from './rental.routes';
import specifications from './specifications.routes';
import users from './users.routes';

export const router = {
  categories,
  cars,
  specifications,
  users,
  authenticate,
  rentals,
};
