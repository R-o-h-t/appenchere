import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Connection: {
        screens: {
          SignIn: "signin",
          SignUp: "signup",
          ConfirmSignUp: "confirmSignUp",
          Reset: "reset",
        },
      },
      Root: {
        screens: {
          Home: {
            screens: {
              Home: "home",
            },
          },
          Profile: {
            screens: {
              Profile: "profile",
            },
          },
        },
      },
      Modal: {
        screens: {
          Product: "product",
          EditProfile: "edit-profile",
        },
      },
      NotFound: "*",
    },
  },
};

export default linking;
