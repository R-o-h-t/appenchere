// @ts-ignore
import { Amplify, DataStore, Hub } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import "intl";
import "intl/locale-data/jsonp/en";
import _ from "lodash";
import React from "react";
import { LogBox, Text } from "react-native";
import { Provider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import awsExport from "./aws-exports";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

LogBox.ignoreLogs(["Warning:..."]); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
Amplify.configure({
  ...awsExport,
  Analytics: {
    disabled: true,
  },
});
Hub.listen("auth", async (data) => {
  if (data.payload.event === "signOut") {
    await DataStore.clear();
  }
});

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <Provider>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
};

export default App;
