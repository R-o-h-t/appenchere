// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Price, Offer, Product, Category, User } = initSchema(schema);

export {
  Price,
  Offer,
  Product,
  Category,
  User
};