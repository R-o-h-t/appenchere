import { createContext } from "react";

export interface Credentials {
  email?: string;
}

const credentialContext = createContext<Credentials>({});

export default credentialContext;
