// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Category, Product, Prices, User, ProductCategory } = initSchema(schema);

export {
  Category,
  Product,
  Prices,
  User,
  ProductCategory
};