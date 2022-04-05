import React, { useEffect, useState } from "react";

import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Prices, Product } from "../../models";
import { Storage } from "aws-amplify";
import { DateTime } from "luxon";
import { Chrono } from "./Chrono";
import { useNavigation } from "@react-navigation/native";

interface Props {
  price: Prices;
}

const ProductCard: React.FC<Props> = ({ price }) => {
  const [image, setImage] = React.useState("");

  const navigation = useNavigation();

  React.useEffect(() => {
    if (price.Product)
      if (price.Product.file)
        Storage.get(price.Product.file, {
          level: "public",
        }).then((i) => setImage(i));
      else setImage("No image");
  }, []);

  React.useEffect(() => {
    if (price.Product)
      Storage.get(`${price.Product.file}`, {
        level: "public",
      }).then((i) => {
        console.log(i);
        setImage(i);
      });
  }, [price]);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Modal", {
          screen: "Product",
          params: { price: price },
        });
      }}
      style={styles.container}
    >
      <View style={styles.img}>
        {image === "" ? (
          <Text style={styles.priceText}>Loading...</Text>
        ) : (
          <Image
            style={{
              width: h,
              height: h,
              resizeMode: "contain",
            }}
            source={{ uri: image }}
          />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.upperContent}>
          <View style={styles.label}>
            <Text style={styles.titleText}>
              {price.Product ? price.Product.label : ""}
            </Text>
          </View>
        </View>
        <View style={styles.bottomContent}>
          <View style={styles.price}>
            <Text style={styles.priceText}>{`${price.value}€`}</Text>
          </View>
          <Chrono
            end={DateTime.fromISO(price.Product?.endedAt!)}
            begin={DateTime.fromISO(price.Product?.startedAt!)}
            styles={StyleSheet.create({
              chrono: {
                position: "absolute",
                left: 5,
                top: 5,
              },
              chronoBegin: {
                color: "green",
              },
              chronoEnd: {
                color: "red",
              },
            })}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const h = 125;

const styles = StyleSheet.create({
  container: {
    height: h,
    margin: 5,
    padding: 5,
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#555",
  },
  img: {
    width: h - 12,
    height: h - 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
    margin: 1,
  },
  content: {
    height: h - 10,
    flexGrow: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#555",
    borderLeftWidth: 1,
    flexDirection: "column",
  },
  label: {
    position: "absolute",
    left: 10,
    top: 20,
  },
  upperContent: {
    position: "relative",
    borderColor: "#555",
    borderBottomWidth: 1,
    width: "100%",
    height: "50%",
  },
  titleText: {
    color: "#FFF",
    fontSize: 20,
  },
  priceText: {
    color: "#FFF",
  },
  bottomContent: {
    position: "relative",
    height: "50%",
    width: "100%",
  },
  price: {
    position: "absolute",
    right: 5,
    bottom: 5,
  },
});
