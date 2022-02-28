// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Prices, Product, User } = initSchema(schema);

export {
  Prices,
  Product,
  User
};