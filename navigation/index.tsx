/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Auth } from "aws-amplify";
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, ColorSchemeName, View } from "react-native";
import ProductModal from "../components/Product/ProductModal";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ConfirmSignUp from "../screens/ConfirmSignUp";
import Home from "../screens/Home";
import NotFound from "../screens/NotFound";
import Profile from "../screens/Profile";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import productContext from '../contexts/productContext';

import EditProfile from "../screens/EditProfile";
import {
    ConnectionStackParamList,
    ModalStackParamList, ProfileStackParamList,
    RootStackParamList,
    RootTabParamList,
    RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Reset from "../screens/Reset";
import CreateOffer from "../screens/CreateOffer";
import CreateOffer2 from "../screens/CreateOffer2";
import ItemUser from "../screens/ItemUser";
import {Product} from "../models";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
    const [product, setProduct] = useState<Product>();
  const [isUserLoggedIn, setUserLoggedIn] = useState<
    "initializing" | "loggedIn" | "loggedOut"
  >("initializing");
  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
      console.log("✅ User is signed in");
      setUserLoggedIn("loggedIn");
    } catch (err) {
      console.log("❌ User is not signed in");
      setUserLoggedIn("loggedOut");
    }
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isUserLoggedIn === "initializing" && <Initializing />}
      {isUserLoggedIn === "loggedIn" && (
          <productContext.Provider value={product}>
              <RootNavigator
                  updateAuthState={setUserLoggedIn}
                  updateProduct={setProduct}
              />
          </productContext.Provider>
      )}
      {isUserLoggedIn === "loggedOut" && (
        <AuthenticationNavigator updateAuthState={setUserLoggedIn} />
      )}
    </NavigationContainer>
  );
}

const Initializing = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
};

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(props: {
    updateProduct: (p: Product) => void;
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" options={{ headerShown: false }}>
        {(screenProps) => (
          <BottomTabNavigator
            {...screenProps}
            updateAuthState={props.updateAuthState}
            updateProduct={props.updateProduct}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Modal"
        options={{ presentation: "modal" }}
      >
          {(screenProps) => (
              <ModalStackNavigator
                  {...screenProps}
                  updateProduct={props.updateProduct}
              />
          )}
          </Stack.Screen>

      <Stack.Screen name={'Profile'} component={ProfileStackNavigator} />

      <Stack.Screen name="NotFound" options={{ title: "Oops!" }}>
        {(screenProps) => (
          <NotFound {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const ModalStack = createNativeStackNavigator<ModalStackParamList>();

function ModalStackNavigator(props: { updateProduct: (p: Product) => void}){
  return (
    <ModalStack.Navigator>
      <ModalStack.Screen
        name="Product"
        component={ProductModal}
        options={{
          headerShown: false,
        }}
      />
      <ModalStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />
        <ModalStack.Screen
            component={CreateOffer2}
        name="CreateOffer2"
        options={{
          headerShown: false,
        }}
                />

    </ModalStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStackNavigator(props: {
    updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
    updateProduct: (p: Product) => void;
}) {
    return (
        <ProfileStack.Navigator initialRouteName="Profile">
            <ProfileStack.Screen
                name="CreateOffer"
                options={{
                    headerShown: false,
                }}

            >
                {(screenProps) => (
                    <CreateOffer {...screenProps} updateProduct={props.updateProduct} />
                )}
            </ProfileStack.Screen>
            <ProfileStack.Screen
                name="Profile"
                options={{
                    headerShown: false,
                }}>{(screenProps) => (
                <Profile {...screenProps} updateAuthState={props.updateAuthState} />
            )}</ProfileStack.Screen>
            <ProfileStack.Screen
                name="ItemUser"
                options={{
                    headerShown: false,
                }}
            >
                {(screenProps) => (
                    <ItemUser
                        {...screenProps}
                        updateProduct={props.updateProduct}
                    />
                )}
                </ProfileStack.Screen>
        </ProfileStack.Navigator>
    );
}



/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
    updateProduct: (product: Product) => void;

}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
          tabBarLabel: "Accueil",
        })}
      >
        {(screenProps) => (
          <Home {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarLabel: "Profil",
          headerShown: true,
          headerTitle: "Profil",
          headerRight: () => (
            <MaterialCommunityIcons.Button
              name="account-edit"
              size={25}
              backgroundColor="#000"
              color="#fff"
              onPress={() => {
                console.log("edit");
                navigation.navigate("Modal", { screen: "EditProfile" });
              }}
            />
          ),
        }}
      >
        {(screenProps) => (
          <ProfileStackNavigator {...screenProps} updateAuthState={props.updateAuthState}     updateProduct={props.updateProduct}           />
        )}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

const AuthenticationStack =
  createNativeStackNavigator<ConnectionStackParamList>();
function AuthenticationNavigator(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  return (
    <AuthenticationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthenticationStack.Screen name="SignIn">
        {(screenProps) => (
          <SignIn {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AuthenticationStack.Screen>

      <AuthenticationStack.Screen name="Reset">
        {(screenProps) => (
          <Reset {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AuthenticationStack.Screen>

      <AuthenticationStack.Screen name="SignUp" component={SignUp} />
      <AuthenticationStack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
      />
    </AuthenticationStack.Navigator>
  );
}
