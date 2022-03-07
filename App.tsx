import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
// @ts-ignore
import { Authenticator, withAuthentificator } from "aws-amplify-react-native";
import Amplify from "aws-amplify";

import awsExport from "./aws-exports";
import React from "react";
import { Text } from "react-native";
Amplify.configure(awsExport);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default () => (
  <Authenticator>
    <App />
  </Authenticator>
);
