import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Auth } from "aws-amplify";
import { SafeAreaView } from "react-native-safe-area-context";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ConnectionStackParamList } from "../types";
import credentialContext, { Credentials } from "../contexts/credencialContext";

export default function ConfirmSignUp(props: {
  updateCredentials: (c: Credentials) => void;
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  const [username, setUsername] = useState("");
  const [authCode, setAuthCode] = useState("");
  const navigation =
    useNavigation<NavigationProp<ConnectionStackParamList, "ConfirmSignUp">>();

  async function confirmSignUp() {
    Auth.confirmSignUp(username, authCode).then(() =>
      props.updateAuthState("loggedIn")
    );
  }
  const email = useContext(credentialContext).email;
  useEffect(() => {
    if (username.length === 0 && email && email.length > 0) {
      setUsername(email);
    }
  }, [email]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Sign Up</Text>
        <AppTextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          leftIcon="account"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppTextInput
          value={authCode}
          onChangeText={(text) => setAuthCode(text)}
          leftIcon="numeric"
          placeholder="Enter verification code"
          keyboardType="numeric"
        />
        <AppButton title="Confirm Sign Up" onPress={confirmSignUp} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 100,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#202020",
    fontWeight: "500",
    marginVertical: 15,
  },
});
