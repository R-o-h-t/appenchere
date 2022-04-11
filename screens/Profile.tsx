import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";

import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { Avatar, Caption, Title, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DataStore } from "@aws-amplify/datastore";
import { User } from "../models";

export default function ProfileScreen(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((u) => setUser(u));
  }, []);

  const [profile, setProfile] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const subscription = DataStore.observeQuery(User, (u) =>
        u.email("eq", user.attributes.email)
      ).subscribe(({ items }) => {
        setProfile(items[0]);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Avatar.Image
            source={{
              uri: "https://pbs.twimg.com/profile_images/1274002655/avatar_normal.jpg",
            }}
            size={80}
          />
          <View style={{ marginLeft: 20 }}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                  color: "#777777",
                },
              ]}
            >{`${profile?.firstname} ${profile?.lastname}`}</Title>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            Toulouse, France
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {profile?.phone}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {profile?.email}
          </Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="heart-outline" color="tomato" size={25} />
            <Text style={styles.menuItemText}>Vos Offres</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="book" color="tomato" size={25} />
            <Text style={styles.menuItemText}>Historique</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
});
