import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import { ConnectionStackParamList } from "../types";

export default function SignIn(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ConnectionStackParamList, "SignIn">>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (route.params && route.params.email && route.params.email.length > 0) {
      setEmail(route.params.email);
    }
  }, []);

  async function signIn() {
    Auth.signIn(email, password)
      .then(() => props.updateAuthState("loggedIn"))
      .catch((err) => setErrorMessage(err.message));
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in to your account</Text>
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
          value={password}
          onChangeText={(text) => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />
        {errorMessage.length > 0 && (
          <Text style={styles.errorMessageText}>{errorMessage}</Text>
        )}
        <View style={styles.footerButtonContainer}>
          <AppButton title="Login" onPress={signIn} />
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpButtonText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
          {errorMessage.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Reset", { email })}
            >
              <Text style={styles.signUpButtonText}>
                Forgotten password ? Reset
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  errorMessageText: {
    color: "tomato",
  },
  title: {
    fontSize: 20,
    color: "#202020",
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
