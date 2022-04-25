import { createContext } from "react";
import { Offer, Price } from "../models";

const offerContext = createContext<
  | {
      offer: Offer;
      currentPrice: Price;
      prices: Price[];
    }
  | undefined
>(undefined);

export default offerContext;
