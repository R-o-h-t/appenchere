import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PriceMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OfferMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CategoryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Price {
  readonly id: string;
  readonly value: number;
  readonly userID: string;
  readonly offerID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Price, PriceMetaData>);
  static copyOf(source: Price, mutator: (draft: MutableModel<Price, PriceMetaData>) => MutableModel<Price, PriceMetaData> | void): Price;
}

export declare class Offer {
  readonly id: string;
  readonly startAt: string;
  readonly endAt: string;
  readonly userID: string;
  readonly prices?: (Price | null)[] | null;
  readonly product?: Product | null;
  readonly isPublished?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly offerProductId?: string | null;
  constructor(init: ModelInit<Offer, OfferMetaData>);
  static copyOf(source: Offer, mutator: (draft: MutableModel<Offer, OfferMetaData>) => MutableModel<Offer, OfferMetaData> | void): Offer;
}

export declare class Product {
  readonly id: string;
  readonly label: string;
  readonly file: string;
  readonly description: string;
  readonly userID: string;
  readonly categoryID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Product, ProductMetaData>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product, ProductMetaData>) => MutableModel<Product, ProductMetaData> | void): Product;
}

export declare class Category {
  readonly id: string;
  readonly label: string;
  readonly products?: (Product | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Category, CategoryMetaData>);
  static copyOf(source: Category, mutator: (draft: MutableModel<Category, CategoryMetaData>) => MutableModel<Category, CategoryMetaData> | void): Category;
}

export declare class User {
  readonly id: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly email: string;
  readonly phone: string;
  readonly products?: (Product | null)[] | null;
  readonly prices?: (Price | null)[] | null;
  readonly offers?: (Offer | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}