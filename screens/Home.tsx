import React from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView } from "react-native";
import ProductCard from "../components/ProductCard";
import { Prices, Product } from "../models";
import { DataStore, Predicates } from "@aws-amplify/datastore";

export default function HomeScreen() {
  const [priceList, setPriceList] = React.useState<Prices[]>([]);
  React.useEffect(() => {
    const subscription = DataStore.observeQuery(Prices, Predicates.ALL, {
      sort: (t) => t.createdAt("DESCENDING"),
    }).subscribe(({ items }) => {
      setPriceList(items);
      console.log(items);
      console.log(items[0].Product);
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
