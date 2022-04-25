import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import OfferCard from "../components/Product/OfferCard";
import { Offer } from "../models";

export default function HomeScreen(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  const [offerList, setOfferList] = React.useState<Offer[]>([]);
  React.useEffect(() => {
    const subscription = DataStore.observeQuery(
      Offer,
      (o) => o.isPublished("eq", true),
      {
        sort: (t) => t.startAt("DESCENDING"),
      }
    ).subscribe(({ items }) => {
      setOfferList(items);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.product_container}
          data={offerList}
          renderItem={({ item }) => <OfferCard offer={item} />}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      <AppButton
        onPress={() => {
          props.updateAuthState("loggedOut");
          Auth.signOut({ global: true });
        }}
        title={"logOut"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  product_container: {
    marginTop: "10%",
    padding: 5,
    width: "100%",
  },
});
