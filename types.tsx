/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Prices } from "./models";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Connection: NavigatorScreenParams<ConnectionStackParamList> | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: NavigatorScreenParams<ModalStackParamList> | undefined;
  NotFound: undefined;
};

export type ConnectionStackScreenProps<
  Screen extends keyof ConnectionStackParamList
> = NativeStackScreenProps<ConnectionStackParamList, Screen>;
export type ConnectionStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  ConfirmSignUp: undefined;
};

export type ModalStackScreenProps<Screen extends keyof ModalStackParamList> =
  NativeStackScreenProps<ModalStackParamList, Screen>;
export type ModalStackParamList = {
  Product: {
    price: Prices;
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
