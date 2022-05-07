import {View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image} from "react-native";
import React, {useState} from "react";
import {Auth} from "@aws-amplify/auth";
import {DataStore} from "@aws-amplify/datastore";
import {Offer, Product, User} from "../models";
import ProductCard from "../components/Product/ProductCard";
import {useNavigation} from "@react-navigation/native";
import ProductCardUser from "../components/Product/ProductCardUser";

interface Props{
    updateProduct: (product: Product) => void;
}

const CreateOffer : React.FC<Props>= ({updateProduct}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [productList, setProductList] = React.useState<Product[]>([]);
    const [user, setUser] = React.useState<User>();

    React.useEffect(() => {
        const fetchUser = async () => {
            const user = await Auth.currentAuthenticatedUser();
            return (
                await DataStore.query(User, (u) =>
                    u.email("eq", user.attributes.email!)
                )
            )[0];
        };
        fetchUser().then((user) => {
            setUser(user);
            setIsLoading(false);
        });
    }, []);

    React.useEffect(() => {
        if (user) {
            const MyProducts = DataStore.observeQuery(Product, (p) =>
                p.userID("eq", user.id)
            ).subscribe(({items}) => {
                setProductList(items);
            });
            return () => MyProducts.unsubscribe();
        }
    }, [user]);


    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <FlatList style={styles.product_container} data={productList}  renderItem={({item}) => <ProductCardUser updateProduct={updateProduct} product={item} />}
                keyExtractor={(item) => item.id} numColumns={2}>

                </FlatList>
            </SafeAreaView>

        </View>
    );
}

export default CreateOffer;

const styles = StyleSheet.create({
    container: {
        color: "white",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
    },
    product_container: {
        borderColor: "#555",
        width: "100%",
        borderWidth: 1,
        borderRadius: 5,

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