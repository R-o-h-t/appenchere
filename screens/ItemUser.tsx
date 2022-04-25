import React, {useContext} from "react";
import {Product} from "../models";
import {View, StyleSheet, Text, Image, TouchableOpacity} from "react-native";
import {Storage} from "aws-amplify";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {ProfileStackParamList} from "../types";
import productContext from "../contexts/productContext";


interface Props {
    updateProduct: (product: Product) => void;
}
const ItemUser : React.FC<Props> = () => {
    const route = useRoute<RouteProp<ProfileStackParamList, 'ItemUser'>>();
    const navigation = useNavigation();


    const product = useContext(productContext);
    const [image, setImage] = React.useState("");

    React.useEffect(() => {
        console.log(product, 'product ------------------------------------------------------------');
        if (product) {
            if (product.file)
                Storage.get(product.file, {level: 'public'})
                    .then(result => {
                        setImage(result);
                        console.log(product.file, 'image ------------------------------------------------------------');
                    })
                    .catch(err => {
                        console.log(err);
                    });
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.imgView}>
                {image === "" ? (
                    <Text>Loading ...</Text>
                ) : (
                    <Image source={{uri: image}} style={{
                        width: 250,
                        height: 250,
                        resizeMode: "contain",
                    }} />
                )}
            </View>

            <TouchableOpacity
                style={styles.commandButton}
                onPress={() => {
                    console.log("Create Offer");
                    navigation.navigate("Modal", {screen: "CreateOffer2"});

                }}
            >
                <Text style={styles.panelButtonTitle}>Créer une Offre</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ItemUser;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    imgView: {
        margin: 10,
        width: 250,
        height: 250,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        backgroundColor: "#212121",
        overflow: "hidden",
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "tomato",
        alignItems: "center",
        marginTop: 10,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "white",
    },
});