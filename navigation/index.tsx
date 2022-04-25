/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Auth, DataStore } from "aws-amplify";
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, ColorSchemeName, View } from "react-native";
import OfferModal from "../components/Product/OfferModal";
import Colors from "../constants/Colors";
import productContext from "../contexts/productContext";
import userContext from "../contexts/userContext";
import useColorScheme from "../hooks/useColorScheme";
import { Product, User } from "../models";
import ConfirmSignUp from "../screens/ConfirmSignUp";
import EditProfile from "../screens/EditProfile";
import Home from "../screens/Home";
import NotFound from "../screens/NotFound";
import Profile from "../screens/Profile";
import Reset from "../screens/Reset";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import {
  ConnectionStackParamList,
  ModalStackParamList,
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const [isUserLoggedIn, setUserLoggedIn] = useState<
    "initializing" | "loggedIn" | "loggedOut"
  >("initializing");
  useEffect(() => {
    checkAuthState();
  }, []);
  const [user, setUser] = useState<User>();
  const [product, setProduct] = useState<Product>();
  const [auth, setAuth] = useState<any>();

  useEffect(() => {
    if (auth) {
      const subscription = DataStore.observeQuery(User, (u) =>
        u.email("eq", auth.attributes.email)
      ).subscribe(({ items }) => {
        setUser(items[0]);
      });
      return () => subscription.unsubscribe();
    }
  }, [auth]);

  async function checkAuthState() {
    Auth.currentAuthenticatedUser()
      .then((u) => {
        setAuth(u);
        console.log("✅ User is signed in");
        setUserLoggedIn("loggedIn");
      })
      .catch(() => {
        console.log("❌ User is not signed in");
        setUserLoggedIn("loggedOut");
      });
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isUserLoggedIn === "initializing" && <Initializing />}
      {isUserLoggedIn === "loggedIn" && user !== undefined && (
        <userContext.Provider value={user}>
          <productContext.Provider value={product}>
            <RootNavigator
              updateAuthState={setUserLoggedIn}
              updateProduct={setProduct}
            />
          </productContext.Provider>
        </userContext.Provider>
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
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
  updateProduct: (p: Product) => void;
}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" options={{ headerShown: false }}>
        {(screenProps) => (
          <BottomTabNavigator
            {...screenProps}
            updateAuthState={props.updateAuthState}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Modal" options={{ presentation: "modal" }}>
        {(screenProps) => (
          <ModalStackNavigator
            {...screenProps}
            updateProduct={props.updateProduct}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="NotFound" options={{ title: "Oops!" }}>
        {(screenProps) => (
          <NotFound {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const ModalStack = createNativeStackNavigator<ModalStackParamList>();

function ModalStackNavigator(props: { updateProduct: (p: Product) => void }) {
  return (
    <ModalStack.Navigator>
      <ModalStack.Screen
        name="Product"
        component={OfferModal}
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
    </ModalStack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
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
                navigation.navigate("Modal", { screen: "EditProfile" });
              }}
            />
          ),
        }}
      >
        {(screenProps) => (
          <Profile {...screenProps} updateAuthState={props.updateAuthState} />
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
