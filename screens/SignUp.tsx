import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Auth, DataStore } from "aws-amplify";
import { SafeAreaView } from "react-native-safe-area-context";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { User } from "../models";
import { ConnectionStackParamList } from "../types";

export default function SignUp() {
  //username = email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //store these to db
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    Auth.signUp({
      username,
      password,
      attributes: {
        email: username,
        phone_number: phoneNumber,
        given_name: firstName,
        family_name: lastName,
      },
    })
      .then((i) => {
        console.log("Successfully signed up!");
        navigation.navigate("ConfirmSignUp");
        DataStore.save(
          new User({
            AuthId: i.userSub,
            firstname: firstName,
            lastname: lastName,
            phone: phoneNumber,
            email: i.user.getUsername(),
          })
        );
      })
      .catch((err) => setErrorMessage(err.message));
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a new account</Text>
        <AppTextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
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
          textContentType="newPassword"
        />
        <AppTextInput
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          leftIcon="account"
          placeholder="Enter FirstName"
          autoCapitalize="words"
          keyboardType="default"
          textContentType="name"
        />
        <AppTextInput
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          leftIcon="account"
          placeholder="Enter LastName"
          autoCapitalize="words"
          keyboardType="default"
          textContentType="name"
        />
        <AppTextInput
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          leftIcon="account"
          placeholder="Enter PhoneNumber"
          autoCapitalize="none"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        {errorMessage.length > 0 && (
          <Text style={styles.errorMessageText}>{errorMessage}</Text>
        )}
        <View style={styles.footerButtonContainer}>
          <AppButton title="Sign Up" onPress={handleSubmit} />
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.forgotPasswordButtonText}>
              Already have an account? Sign In
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
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginBlock: "10rem",
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
