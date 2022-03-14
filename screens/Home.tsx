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
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <SafeAreaView style={styles.container}>
        <FlatList
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  product_container: {
    width: "100%",
    padding: 5,
  },
});
