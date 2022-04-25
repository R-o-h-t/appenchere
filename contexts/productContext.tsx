import { createContext } from "react";
import { Product } from "../models";

const productContext = createContext<Product | undefined>(undefined);

export default productContext;
