import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import ProductCard from "../components/Product/ProductCard";
import { Price } from "../models";

export default function HomeScreen(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
}) {
  const [priceList, setPriceList] = React.useState<Price[]>([]);
  React.useEffect(() => {
    const subscription = DataStore.observeQuery(Price, Predicates.ALL, {
      sort: (t) => t.createdAt("DESCENDING"),
    }).subscribe(({ items }) => {
      setPriceList(items);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.product_container}
          data={priceList}
          renderItem={({ item }) => <ProductCard price={item} />}
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
    marginTop: "20%",
    padding: 5,
    width: "100%",
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 5,
  },
});
