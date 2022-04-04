/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme, useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import Home from "../screens/Home";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import {
    ModalStackParamList,
    RootStackParamList,
    RootTabParamList,
    RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import {MaterialCommunityIcons} from "@expo/vector-icons";


export default function Navigation({
                                       colorScheme,
                                   }: {
    colorScheme: ColorSchemeName;
}) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Modal"
                component={ModalStackNavigator}
                options={{ presentation: "modal" }}
            />
        </Stack.Navigator>
    );
}

const ModalStack = createNativeStackNavigator<ModalStackParamList>();

function ModalStackNavigator() {
    return (
        <ModalStack.Navigator>
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
/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

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
                component={Home}
                options={({ navigation }: RootTabScreenProps<"Home">) => ({
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                    headerShown: false,
                    tabBarLabel: "Accueil",
                })}
            />
            <BottomTab.Screen
                name="Profile"
                component={Profile}
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
                                navigation.navigate("Modal", {screen: "EditProfile"}
                            )}}
                        />
                    ),
                }}
            />
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