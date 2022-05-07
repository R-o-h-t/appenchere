import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import { Credentials } from "../contexts/credencialContext";
import { ConnectionStackParamList } from "../types";

export default function Reset(props: {
  updateCredentials: (c: Credentials) => void;
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  const route = useRoute<RouteProp<ConnectionStackParamList, "Reset">>();
  const navigation =
    useNavigation<NavigationProp<ConnectionStackParamList, "Reset">>();

  const [email, setEmail] = useState("");
  const [reset, setReset] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (route.params && route.params.email && route.params.email.length > 0) {
      setEmail(route.params.email);
      Auth.forgotPassword(route.params.email)
        .then(() => {})
        .catch((err) => setErrorMessage(err.message));
    }
  }, []);

  async function resetPassword() {
    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match");
      return;
    }
    Auth.forgotPasswordSubmit(email, reset, password)
      .then(() => navigation.navigate("SignIn", { email }))
      .catch((err) => console.error(err));
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset password</Text>
        <AppTextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          leftIcon="email"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppTextInput
          value={reset}
          onChangeText={(text) => setReset(text)}
          leftIcon="email"
          placeholder="Enter reset code"
          autoCapitalize="none"
          keyboardType="default"
          textContentType="oneTimeCode"
        />
        <AppTextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="newPassword"
        />
        <AppTextInput
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(text)}
          leftIcon="lock"
          placeholder="Confirm password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="newPassword"
        />
        {errorMessage.length > 0 && (
          <Text style={styles.errorMessageText}>{errorMessage}</Text>
        )}
        <View style={styles.footerButtonContainer}>
          <AppButton title="Login" onPress={resetPassword} />
          <TouchableOpacity onPress={() => navigation.navigate("SignUp", {})}>
            <Text style={styles.signUpButtonText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
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
    marginVertical: 10,
  },
  errorMessageText: {
    color: "tomato",
  },
  title: {
    fontSize: 20,
    color: "#808080",
    fontWeight: "500",
    marginVertical: 15,
  },
  footerButtonContainer: {
    marginTop: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPasswordButtonText: {
    color: "tomato",
    fontSize: 18,
    fontWeight: "600",
  },
  signUpButtonText: {
    color: "tomato",
    fontSize: 18,
    fontWeight: "600",
  },
});
