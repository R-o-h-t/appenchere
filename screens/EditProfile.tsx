import {Button, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {DataStore} from "@aws-amplify/datastore";
import {User} from "../models";
import {Auth} from "@aws-amplify/auth";





const EditProfile = async () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [profile, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);


    const user = await Auth.currentAuthenticatedUser();
    React.useEffect(() => {
        const fetchUser = async () => {
            return (
                await DataStore.query(User, (u) => u.AuthId("eq", user.id!))
            )[0];
        };
        fetchUser().then(async (connectedUser) => {
            if (!connectedUser) {
                //ERROR
            } else {
                setUser(connectedUser);
            }
            setIsLoading(false);
        });
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
            <Text>Edit Profile</Text>

            <View style={styles.action}>
                <FontAwesome name="user-o" color={'#fff'} size={20}/>
                <TextInput
                    placeholder="Nom"
                    placeholderTextColor="#fff"
                    autoCorrect={false}
                    style={styles.textInput}
                    onChangeText={setLastName}
                />
            </View>
            <View style={styles.action}>
                <FontAwesome name="user-o" color={'#fff'} size={20}/>
                <TextInput
                    placeholder="Prénom"
                    placeholderTextColor="#fff"
                    autoCorrect={false}
                    style={styles.textInput}
                    onChangeText={setFirstName}
                />
            </View>
            <View style={styles.action}>
                <FontAwesome name="phone" color={'#fff'} size={20}/>
                <TextInput
                    placeholder="Numeros de téléphone"
                    placeholderTextColor="#fff"
                    keyboardType={'number-pad'}
                    autoCorrect={false}
                    style={styles.textInput}
                    onChangeText={setPhone}
                />
            </View>

            <TouchableOpacity style={styles.commandButton} onPress={() => {

                function editProfile() {
                    if (!profile) {
                        return;
                    }
                    DataStore.save(
                        User.copyOf(profile, (updated) => {
                            updated.firstname = firstName;
                            updated.lastname = lastName;
                                updated.phone = phone;
                        }),
                    );
                }

                editProfile();
            }}>
                <Text style={styles.panelButtonTitle}>
                    Enregistrer
                </Text>
            </TouchableOpacity>
        </View>
    );
};
export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#fff',
    },
});