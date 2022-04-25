import { useNavigation } from "@react-navigation/native";
import { DataStore, Storage } from "aws-amplify";
import { DateTime } from "luxon";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Offer, Price } from "../../models";
import { Chrono } from "./Chrono";

interface Props {
  offer: Offer;
}

const OfferCard: React.FC<Props> = ({ offer }) => {
  const [image, setImage] = React.useState("");
  const [currentPrice, setCurrentPrice] = React.useState<Price>();
  const [prices, setPrices] = React.useState<Price[]>();

  const navigation = useNavigation();

  React.useEffect(() => {
    if (offer.product && offer.product.file) {
      Storage.get(offer.product.file, {
        level: "public",
      }).then(
        (i) => {
          setImage(i);
        },
        (e) => console.error(e)
      );
    }
  }, [offer]);

  React.useEffect(() => {
    if (offer.prices) {
      setPrices(offer.prices.filter((p) => !!p) as Price[]);
    } else {
      DataStore.query(Price, (p) => p.offerID("eq", offer.id)).then((p) =>
        setPrices(p)
      );
    }
  }, [offer]);

  React.useEffect(() => {
    if (prices) {
      setCurrentPrice(
        prices.reduce((prev, current) => {
          return !current || prev!.value > current.value ? prev : current;
        }, new Price({ value: 0, userID: "", offerID: "" })) || undefined
      );
    }
  }, [prices]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Modal", {
          screen: "Product",
          params: {
            offer,
            image,
            prices,
          },
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
              {offer.product ? offer.product.label : ""}
            </Text>
          </View>
        </View>
        <View style={styles.bottomContent}>
          <View style={styles.offer}>
            <Text style={styles.priceText}>{`${
              currentPrice ? currentPrice.value : 0
            }€`}</Text>
          </View>
          <Chrono
            end={DateTime.fromISO(offer.endAt)}
            begin={DateTime.fromISO(offer.startAt)}
            styles={StyleSheet.create({
              container: {
                marginVertical: "auto",
                marginHorizontal: "auto",
              },
              text: {
                color: "white",
              },
            })}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OfferCard;

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
    elevation: 5,
  },

  img: {
    width: h - 12,
    height: h - 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
    margin: 1,
    backgroundColor: "#212121",
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
    marginVertical: "auto",
    marginRight: "auto",
    marginLeft: 20,
  },
  upperContent: {
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
    height: "50%",
    width: "100%",
    position: "relative",
  },
  offer: {
    marginVertical: "auto",
    marginRight: 20,
    marginLeft: "auto",
  },
});
