import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PricesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Prices {
  readonly id: string;
  readonly value?: number;
  readonly Product?: Product;
  readonly User?: User;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly pricesProductId?: string;
  readonly pricesUserId?: string;
  constructor(init: ModelInit<Prices, PricesMetaData>);
  static copyOf(source: Prices, mutator: (draft: MutableModel<Prices, PricesMetaData>) => MutableModel<Prices, PricesMetaData> | void): Prices;
}

export declare class Product {
  readonly id: string;
  readonly label?: string;
  readonly userID?: string;
  readonly file?: string;
  readonly info?: string;
  readonly startedAt?: string;
  readonly endedAt?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Product, ProductMetaData>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product, ProductMetaData>) => MutableModel<Product, ProductMetaData> | void): Product;
}

export declare class User {
  readonly id: string;
  readonly Products?: (Product | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}