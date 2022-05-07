import { useContext } from "react";
import authenticatedUserContext from "../contexts/userContext";

export default function useAuthenticatedUser() {
  return useContext(authenticatedUserContext);
}
