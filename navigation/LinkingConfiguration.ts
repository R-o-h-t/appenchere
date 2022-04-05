/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

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
        },
      },
      NotFound: "*",
    },
  },
};

export default linking;
