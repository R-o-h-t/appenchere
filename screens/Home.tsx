import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { PaperSelect } from "react-native-paper-select";
import AppButton from "../components/AppButton";
import OfferCard from "../components/Product/OfferCard";
import { Category, Offer, Price } from "../models";

export default function HomeScreen(props: {
  updateAuthState: (s: "initializing" | "loggedIn" | "loggedOut") => void;
  updateOffer: (o: {
    offer: Offer;
    image: string;
    prices: Price[];
    currentPrice: Price;
  }) => void;
}) {
  const [offerList, setOfferList] = React.useState<Offer[]>([]);
  const [filteredOfferList, setFilteredOfferList] = React.useState<Offer[]>([]);
  React.useEffect(() => {
    const subscription = DataStore.observeQuery(
      Offer,
      (o) => o.isPublished("eq", true),
      {
        sort: (t) => t.startAt("DESCENDING"),
      }
    ).subscribe(({ items }) => {
      setOfferList(items);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [filters, setFilters] = useState<{
    value: string;
    list: { _id: string; value: string }[];
    selectedList: { _id: string; value: string }[];
    error: string;
  }>({
    value: "",
    list: [{ _id: "1", value: "...loading" }],
    selectedList: [],
    error: "",
  });

  React.useEffect(() => {
    const subscription = DataStore.observeQuery(
      Category,
      Predicates.ALL
    ).subscribe(({ items }) => {
      setFilters({
        ...filters,
        list: items.map(({ label, id }) => {
          return {
            _id: `${id}`,
            value: label,
          };
        }),
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("");

  React.useEffect(() => {
    if (filters.selectedList.length === 0) {
      setFilteredOfferList(offerList);
    } else {
      setFilteredOfferList(
        offerList.filter((o) =>
          setSelectedCategory(filters.selectedList[0]._id)
        )
      );
    }
  }, [filters]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <PaperSelect
          multiEnable={false}
          label="Select Category"
          value={filters.value}
          onSelection={(value: any) => {
            setFilters({
              ...filters,
              value: value.text,
              selectedList: value.selectedList,
              error: "",
            });
          }}
          arrayList={[...filters.list]}
          selectedArrayList={filters.selectedList}
          errorText={filters.error}
          textInputMode="flat"
          textInputBackgroundColor="#202020"
          searchStyle={{
            iconColor: "#E7E7E7",
            textColor: "#E7E7E7",
            backgroundColor: "#202020",
          }}
          checkboxColor="tomato"
          checkboxUncheckedColor="#D7D7D7"
          checkboxLabelStyle={{ color: "#E7E7E7" }}
          outlineColor="tomato"
          dialogStyle={{
            backgroundColor: "#202020",
          }}
          dialogTitleStyle={{
            color: "#E7E7E7",
          }}
          dialogButtonLabelStyle={{
            color: "#E7E7E7",
          }}
        />
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.product_container}
          data={filteredOfferList}
          renderItem={({ item }) => (
            <OfferCard
              offer={item}
              updateOffer={props.updateOffer}
              category={selectedCategory}
            />
          )}
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
  filterContainer: {
    width: "100%",
    padding: 5,
  },
  container: {
    marginTop: 40,
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  product_container: {
    padding: 5,
    width: "100%",
  },
});
