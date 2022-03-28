import React from "react";

import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Prices, Product } from "../models";
import { Storage } from "aws-amplify";
import { DateTime } from "luxon";

interface Props {
  price: Prices;
}

const ProductCard: React.FC<Props> = ({ price }) => {
  const Chrono = () => {
    if (price.Product && price.Product.startedAt && price.Product.endedAt) {
      const begin = DateTime.fromISO(price.Product.startedAt);
      console.log(begin);
      const end = DateTime.fromISO(price.Product.endedAt);
      const now = DateTime.now();

      if (begin > now) {
        return (
          <Text style={styles.chrono}>
            {now.diff(begin).toFormat("dd'd'HH'h'mm'm'")}
          </Text>
        );
      } else
        return (
          <Text style={styles.chrono}>
            {now.diff(end).toFormat("dd 'd' hh 'h' mm 'm")}
          </Text>
        );
    }
    return <Text style={styles.chrono}>blank</Text>;
  };

  const [image, setImage] = React.useState("");

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
        console.log("clicked");
      }}
      style={styles.container}
    >
      <View style={styles.img}>
        {image === "" ? (
          <Text style={styles.text}>Loading...</Text>
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
        <View style={styles.label}>
          <Text style={styles.text}>
            {price.Product ? price.Product.label : ""}
          </Text>
        </View>
        <View>
          <View>
            <Text style={styles.text}>{`${price.value}€`}</Text>
          </View>
          <View>
            <Text style={styles.text}>{`"`}</Text>
          </View>
        </View>
      </View>
      <View style={styles.chrono}>
        <Chrono />
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
  label: { borderColor: "#555", borderBottomWidth: 1, width: "100%" },
  text: {
    color: "#FFF",
  },
  chrono: {
    color: "#FFF",
  },
});
