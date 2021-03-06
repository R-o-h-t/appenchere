import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Storage } from "aws-amplify";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../../models";
import { ProfileStackParamList } from "../../types";

interface Props {
  product: Product;
  updateProduct: (product: Product) => void;
}

const ProductCardUser: React.FC<Props> = ({ product, updateProduct }) => {
  const [image, setImage] = React.useState("");
  const navigation =
    useNavigation<NavigationProp<ProfileStackParamList, "Profile">>();

  React.useEffect(() => {
    if (product.file)
      Storage.get(product.file, { level: "public" })
        .then((result) => {
          setImage(result);
        })
        .catch((err) => {
          console.error(err);
        });
  });

  return (
    <View style={styles.img}>
      {image === "" ? (
        <Text style={styles.priceText}>Loading...</Text>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ItemUser", { product: product });
            updateProduct(product);
          }}
          style={styles.img}
        >
          <Image
            style={{
              width: 190,
              height: 190,
              resizeMode: "contain",
            }}
            source={{ uri: image }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductCardUser;

const styles = StyleSheet.create({
  img: {
    width: "auto",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
    margin: 1,
  },
  priceText: {
    color: "#FFF",
  },
  product: {},
});
