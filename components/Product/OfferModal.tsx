import { RouteProp, useRoute } from "@react-navigation/native";
import { DataStore, Auth } from "aws-amplify";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FAB } from "react-native-paper";
import { Price, User } from "../../models";
import { ModalStackParamList } from "../../types";
import JoinOfferDialog from "../Dialog/JoinOfferDialog";

export default function OfferModal() {
  const route = useRoute<RouteProp<ModalStackParamList, "Product">>();
  const { offer, image, prices } = route.params;

  const [currentPrice, setCurrentPrice] = useState<Price>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [author, setAuthor] = useState<User>();

  const [connectedUser, setConnectedUser] = useState<any>();

  const [joinOfferDialogVisible, setJoinOfferDialogVisible] = useState(false);

  React.useEffect(() => {
    Auth.currentAuthenticatedUser().then((u) => {
      setConnectedUser(u);
    });
    if (offer) {
      if (offer.userID) {
        DataStore.query(User, offer.userID).then((u) => {
          setAuthor(u);
        });
      }
    }
  }, [offer]);

  React.useEffect(() => {
    if (prices)
      setCurrentPrice(
        prices.reduce((prev, current) => {
          return !current || prev!.value > current.value ? prev : current;
        }, new Price({ value: 0, userID: "", offerID: "" })) || undefined
      );
  }, [prices]);

  React.useEffect(() => {
    if (currentPrice) {
      DataStore.query(User, currentPrice.userID).then((u) => {
        setCurrentUser(u);
      });
    }
  }, [currentPrice]);

  return (
    <View style={styles.container}>
      <View style={styles.imgView}>
        {image === "" ? (
          <Text>Loading...</Text>
        ) : (
          <Image style={styles.img} source={{ uri: image }} />
        )}
      </View>
      <View style={styles.userView}>
        <View style={styles.authorView}>
          <Text style={styles.authorText}>{"Auteur de l'offre : "}</Text>
          <Text style={styles.authorText}>
            {author ? `${author.firstname} ${author.lastname}` : "@author"}
          </Text>
        </View>
        <View style={styles.currentView}>
          <View style={styles.priceView}>
            <Text style={styles.priceText}>
              {currentPrice ? `${currentPrice.value} €` : "0.00 €"}
            </Text>
          </View>
          <View style={styles.possessorView}>
            <Text style={styles.possessorText}>
              {currentUser
                ? `${currentUser.firstname} ${currentUser.lastname}`
                : "@currentUser"}
            </Text>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.descView}>
        <View style={styles.descLabelView}>
          <Text style={styles.descLabelText}>{"Description"}</Text>
        </View>
        <ScrollView style={styles.descBodyView}>
          <Text style={styles.descBodyText}>
            {offer && offer.product ? offer?.product.description : "..."}
          </Text>
        </ScrollView>
      </SafeAreaView>
      {currentUser && connectedUser.username === currentUser.email ? (
        <FAB
          style={styles.fab}
          accessibilityLabel="participer a l'offre"
          icon="check"
          label="Vous êtes premier sur cette offre"
          theme={{ colors: { accent: "tomato" } }}
        />
      ) : (
        <>
          <FAB
            style={styles.fab}
            accessibilityLabel="participer a l'offre"
            icon="plus"
            label="participer a l'offre"
            onPress={() => setJoinOfferDialogVisible(true)}
            theme={{ colors: { accent: "tomato" } }}
          />
          <JoinOfferDialog
            visible={joinOfferDialogVisible}
            offer={offer!}
            currentPrice={currentPrice!}
            onCancel={() => setJoinOfferDialogVisible(false)}
            onValidate={() => setJoinOfferDialogVisible(false)}
          />
        </>
      )}
    </View>
  );
}
const h = 250;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  imgView: {
    margin: 10,
    width: h,
    height: h,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#212121",
    overflow: "hidden",
  },
  img: {
    width: h,
    height: h,
    resizeMode: "contain",
  },
  userView: {
    margin: 10,
    flexDirection: "row",
    width: "100%",
  },
  authorView: {
    margin: 10,
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
  },
  authorText: {
    color: "white",
  },
  currentView: {
    margin: 10,
    flexDirection: "column",
    alignItems: "center",
    borderColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    width: "40%",
  },
  priceView: {
    margin: 10,
    marginBottom: 0,
    alignItems: "center",
  },
  priceText: {
    color: "white",
  },
  possessorView: {
    margin: 10,
    marginTop: 0,
    alignItems: "center",
  },
  possessorText: {
    color: "white",
  },
  descView: {
    width: "80%",
    height: "30%",
    margin: 15,
    alignItems: "center",
    flexDirection: "column",
    borderColor: "white",
    borderRadius: 5,
    borderWidth: 1,
  },
  descLabelView: {
    margin: 10,
    flexDirection: "row",
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  descLabelText: {
    color: "white",
  },
  descBodyView: {
    margin: 10,
  },
  descBodyText: {
    textAlign: "center",
    color: "white",
  },
});
