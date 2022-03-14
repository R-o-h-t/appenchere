import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Prices, Product } from "../models";

interface Props {
  price: Prices;
}

const ProductCard: React.FC<Props> = ({ price }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("clicked");
      }}
      style={styles.container}
    >
      <View style={styles.price}>
        <Text>{price.value}</Text>
      </View>
      <View>
        <Text style={styles.label}>
          {price.Product ? price.Product.label : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const h = 100;

const styles = StyleSheet.create({
  container: {
    height: h,
    margin: 5,
    flexDirection: "row",
    backgroundColor: "#E7E",
  },
  price: {
    width: h,
    height: h,
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: "#7E7",
  },
  label: {},
});
