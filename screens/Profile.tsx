import { Auth } from "aws-amplify";
import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

export default function ProfileScreen(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
