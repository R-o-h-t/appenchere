import { createContext } from "react";
import { Offer, Price } from "../models";

const offerContext = createContext<{
  offer?: Offer;
  image?: string;
  currentPrice?: Price;
  prices?: Price[];
}>({});

export default offerContext;
