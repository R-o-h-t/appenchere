import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Image } from "react-native";
import { ModalStackParamList } from "../../types";
import { Storage } from "aws-amplify";
import { DateTime } from "luxon";
import { Chrono } from "./Chrono";

export default function ProductModal() {
  const route = useRoute<RouteProp<ModalStackParamList, "Product">>();
  const navigation =
    useNavigation<NavigationProp<ModalStackParamList, "Product">>();
  const { price } = route.params;
  const [image, setImage] = useState("");

  useEffect(() => {
    if (price.Product)
      if (price.Product.file)
        Storage.get(price.Product.file, {
          level: "public",
        }).then((i) => setImage(i));
      else setImage("");
  }, []);
  return (
    <View>
      <View>
        <View>
          <Text style={[styles.text, styles.label]}>
            {price.Product?.label || "label"}
          </Text>
        </View>
        <View>
          <Text style={[styles.text, styles.label]}>
            {price.value || "price"} €
          </Text>
        </View>
      </View>
      <View>
        {image === "" ? (
          <Text>Loading...</Text>
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
      <View>
        <Chrono
          begin={
            price.Product?.startedAt
              ? DateTime.fromISO(price.Product?.startedAt)
              : DateTime.local()
          }
          end={
            price.Product?.endedAt
              ? DateTime.fromISO(price.Product?.endedAt)
              : DateTime.local()
          }
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
      <View>
        <Text style={[styles.text, styles.label]}>
          {price.Product?.description || "description"}
        </Text>
      </View>
    </View>
  );
}
const h = 250;
const styles = StyleSheet.create({
  text: {
    color: "white",
  },
  label: {
    fontSize: 20,
  },
});
