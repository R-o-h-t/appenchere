import { Auth } from "@aws-amplify/auth";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import productContext from "../contexts/productContext";
import { Category, Offer, Price, User } from "../models";

const CreateOffer2 = () => {
  const [startPrice, setStartPrice] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dateStart, setDateStart] = React.useState(new Date());
  const [timeStart, setTimeStart] = React.useState(new Date());

  const [dateEnd, setDateEnd] = React.useState(new Date());
  const [timeEnd, setTimeEnd] = React.useState(new Date());

  useEffect(() => {
    const subscription = DataStore.query(Category, Predicates.ALL).then(
      (items) => {
        setCategories(items);
        setIsLoading(false);
      }
    );
  }, []);

  const renderCategoryList = () => {
    return categories.map((category) => {
      return (
        <Picker.Item
          label={category.label}
          value={category.label}
          key={category.id}
        />
      );
    });
  };

  const product = useContext(productContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  async function getUser() {
    const user = await Auth.currentAuthenticatedUser();
    return (
      await DataStore.query(User, (u) => u.email("eq", user.attributes.email!))
    )[0];
  }

  async function SaveOffer() {
    if (!product) {
      return;
    }
    let timeStartString = DateTime.fromISO(dateStart.toISOString())
      .set({ hour: timeStart.getHours(), minute: timeStart.getMinutes() })
      .toISO();
    let timeEndString = DateTime.fromISO(dateEnd.toISOString())
      .set({ hour: timeEnd.getHours(), minute: timeEnd.getMinutes() })
      .setLocale("fr")
      .toISO();

    let timeS = new Date(timeStartString).toISOString();
    let timeE = new Date(timeEndString).toISOString();

    let price = parseInt(startPrice);
    const user = await getUser();

    const offer = await DataStore.save(
      new Offer({
        startAt: timeS,
        endAt: timeE,
        userID: user.id,
        isPublished: true,
        product,
      })
    );
    await DataStore.save(
      new Price({
        offerID: offer.id,
        value: price,
        userID: user.id,
      })
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerForm}>
        <Text style={styles.titleLabel}>Nom de l'offre</Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Nom"
            placeholderTextColor="#fff"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>

        <Text style={styles.titleLabel}>Date de debut</Text>
        <View style={styles.test}>
          <View style={{ width: "50%" }}>
            <DateTimePicker
              style={styles.datePicker}
              value={dateStart}
              mode={"date"}
              onChange={(event, date) => {
                if (date) {
                  setDateStart(date);
                }
              }}
            />
          </View>
          <View style={{ width: "50%" }}>
            <DateTimePicker
              style={styles.datePicker}
              value={timeStart}
              mode={"time"}
              onChange={(event, date) => {
                if (date) {
                  setTimeStart(date);
                }
              }}
            />
          </View>
        </View>

        <Text style={styles.titleLabel}>Date de fin</Text>
        <View style={styles.test}>
          <View style={{ width: "50%" }}>
            <DateTimePicker
              style={styles.datePicker}
              value={dateEnd}
              mode={"date"}
              onChange={(event, date) => {
                if (date) {
                  setDateEnd(date);
                }
              }}
            />
          </View>
          <View style={{ width: "50%" }}>
            <DateTimePicker
              style={styles.datePicker}
              value={timeEnd}
              mode={"time"}
              onChange={(event, date) => {
                if (date) {
                  setTimeEnd(date);
                }
              }}
            />
          </View>
        </View>

        <Text style={styles.titleLabel}>Prix de Départ</Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Prix de depart en €"
            placeholderTextColor="#fff"
            autoCorrect={false}
            keyboardType="numeric"
            style={styles.textInput}
            onChangeText={setStartPrice}
          />
        </View>

        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => {
            SaveOffer();
            //editProfile();
          }}
        >
          <Text style={styles.panelButtonTitle}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateOffer2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#545151",
    alignItems: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#f2f2f2",
    paddingVertical: 10,
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    borderColor: "#fff",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 7,
    color: "#fff",
  },
  commandButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#00a680",
    borderRadius: 3,
  },
  panelButtonTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  titleLabel: {
    textAlign: "center",
    width: "100%",
    fontSize: 20,
    color: "#fff",
  },
  picker: {
    paddingTop: 10,
    width: 150,
    height: 50,
  },
  datePicker: {
    height: 50,
    width: "100%",
  },

  containerForm: {
    marginTop: "10%",
    alignItems: "center",
    width: "100%",
  },
  test: {
    alignContent: "stretch",
    flexDirection: "row",
    marginRight: "17%",
    alignItems: "center",
    justifyContent: "center",
  },
});
