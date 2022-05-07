import { createContext } from "react";
import { User } from "../models";

const authenticatedUserContext = createContext<User | undefined>(undefined);

export default authenticatedUserContext;
