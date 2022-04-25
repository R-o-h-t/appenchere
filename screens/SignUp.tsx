import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Auth, DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Dialog, FAB, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import { User } from "../models";
import { ConnectionStackParamList } from "../types";

export default function SignUp() {
  /**
   * Auth
   * username = email
   */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  /**
   * User (DataStore)
   */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [showErrors, setShowErrors] = useState(false);

  const route = useRoute<RouteProp<ConnectionStackParamList, "SignUp">>();

  useEffect(() => {
    if (route.params && route.params.email && route.params.email.length > 0) {
      setUsername(route.params.email);
    }
  }, []);

  useEffect(() => {
    const errors: string[] = [];

    if (password) {
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
      }
      if (!password.match("(?=.*d)")) {
        errors.push("Password must contain at least one number");
      }
      if (!password.match("(?=.*[a-z])")) {
        errors.push("Password must contain at least one lowercase letter");
      }
      if (!password.match("(?=.*[A-Z])")) {
        errors.push("Password must contain at least one uppercase letter");
      }
      if (!password.match("(?=.*[!@#$%^&*])")) {
        errors.push("Password must contain at least one special character");
      }
      if (confirm && password !== confirm) {
        errors.push("Passwords do not match");
      }
      setErrorMessages(errors);
    }
  }, [password, confirm]);

  const navigation =
    useNavigation<NavigationProp<ConnectionStackParamList, "SignUp">>();

  const handleSubmit = async () => {
    if (password === confirm) {
      Auth.signUp({
        username,
        password,
        attributes: {
          email: username,
          phone_number: simplifyPhone(phoneNumber),
          given_name: firstName,
          family_name: lastName,
        },
      })
        .then(({ user }) => {
          console.log("Successfully signed up!");
          navigation.navigate("ConfirmSignUp", {
            email: username,
          });
          DataStore.save(
            new User({
              firstname: firstName,
              lastname: lastName,
              phone: phoneNumber,
              email: user.getUsername(),
            })
          );
        })
        .catch((e) => {
          setErrorMessages([...e.message]);
          setShowErrors(true);
        });
    } else {
      setErrorMessages([..."Passwords do not match"]);
    }
  };

  const simplifyPhone = (phone: string) => {
    if (phone.slice(0, 2).includes("+")) {
      return phone;
    } else if (phone.slice(0, 2).includes("00")) {
      return `+${phone.substring(2)}`;
    } else if (phone.slice(0, 1).includes("0")) {
      return `+33${phone.substring(1)}`;
    }
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
          value={confirm}
          onChangeText={(text) => setConfirm(text)}
          leftIcon="lock"
          placeholder="Confirm password"
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
        {errorMessages.length > 0 && (
          <View style={styles.errorView}>
            <FAB
              icon="alert-circle-outline"
              small
              style={styles.fab}
              theme={{ colors: { accent: "tomato" } }}
              color="white"
              onPress={() => setShowErrors(true)}
            />
            <Badge
              style={styles.badge}
              onPressIn={() => {}}
              onPressOut={() => {}}
            >
              {errorMessages.length}
            </Badge>
            <Portal>
              <Dialog
                visible={showErrors}
                onDismiss={() => {
                  setShowErrors(false);
                }}
              >
                <Dialog.Content>
                  <SafeAreaView>
                    <FlatList
                      data={errorMessages}
                      renderItem={({ item }) => {
                        return (
                          <Text style={styles.errorMessageText}> - {item}</Text>
                        );
                      }}
                    />
                  </SafeAreaView>
                </Dialog.Content>
              </Dialog>
            </Portal>
          </View>
        )}
        <View style={styles.footerButtonContainer}>
          <AppButton title="Sign Up" onPress={handleSubmit} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SignIn", {
                email: username,
              })
            }
          >
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
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginVertical: 20,
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
    alignItems: "center",
    width: "100%",
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
  errorView: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  fab: {
    opacity: 0.9,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "tomato",
    color: "white",
  },
});
