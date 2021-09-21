import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationActions } from 'react-navigation';
import Constants from '../../../utills/Constants';
import AntDesign from "react-native-vector-icons/AntDesign";
import { languageList } from '../../../utills/userdata';
import PouchDB from 'pouchdb-react-native';

var userDB = new PouchDB('usersettings');

const ChooseLanguageScreen = (props) => {

    const userSettings = props.navigation.getParam('userSettings', 'nothing sent');
    const from = props.navigation.getParam('from', 'nothing sent');
    const [DisplayLanguageData, setDisplayLanguageData] = useState(userSettings)
    const [languageSelected, setLanguageSelected] = useState(from=='profile'? DisplayLanguageData?.doc?.DisplayLanguage: userSettings?.doc?.Dictionary?.language)
    
    const { t, i18n } = useTranslation();

    const goBack = () => props.navigation.dispatch(NavigationActions.back())


    async function fetchUserSettings(){
        userDB.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                    setUserSettings({})
                    return console.log(err);
                }
                
               console.log("user settings data ", JSON.stringify(response.rows[0]))
               setDisplayLanguageData(response.rows[0])
                return response.rows[0];

            },
        );
    }

     function updateUserSettings(item) {
        console.log('languageSelected : ', languageSelected)
        userDB.get(DisplayLanguageData.id).then(function (doc) {
            let newObject ={}
            if(from=='profile'){
                newObject = {
                    ...doc,
                    "DisplayLanguage":item
                }
            }else{
                newObject = {
                    ...doc,
                    "Dictionary":{
                        ...doc?.Dictionary,
                        language:item
                    }
                }
            }
            console.log('new obj doc : ',JSON.stringify(newObject))
            userDB.put(newObject).then((response)=>{
                console.log('responcen : ',response)
                //goBack()
                fetchUserSettings()
            }).catch((e)=>
            console.log('ERORor: ',e))
        }).catch(function (err) {
            console.log('EROR : ', err);
        });

    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ width: 100, left: -4, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={()=>{goBack()}}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chevron-back-sharp' size={23} color={Constants.appColors.WHITE} />
                            <Text style={{ fontSize: 18, color: 'white' }}>{from=='profile'? `Profile`:`Dictionary`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textStyle}>{from=='profile'? `Display Language`:`Language`}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
                <View style={{ marginTop: 12, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 10 }}>
                    <FlatList
                    data={languageList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={async() => {
                            setLanguageSelected(item)
                            updateUserSettings(item);
                        }}>
                            <View style={styles.MenuItems} key={`${item.id}`}>
                                <Text style={{ marginLeft: 12, fontWeight: 'bold', color: Constants.appColors.BLACK,fontSize:16 }}>{item.label}</Text>
                                {
                                    languageSelected && languageSelected.id == item.id && <View style={styles.MenuItemIconStyle}><AntDesign name='checkcircle' color={Constants.appColors.PRIMARY_COLOR} size={18} /></View>
                                }
                            </View>
                        </TouchableOpacity>
                    )} />
                </View>
            </View>
        </View>
    )
}

ChooseLanguageScreen.navigationOptions = {
    headerShown: false
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Constants.appColors.PRIMARY_COLOR,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        flexDirection: 'row',
    },
    textStyle: {
        color: Constants.appColors.WHITE,
        fontSize: 20,
        marginLeft: 8,
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    MenuItems: {
        height: 40,
        borderBottomWidth: .5,
        borderBottomColor: Constants.appColors.LIGHTGRAY,
        justifyContent: 'center'
    },
    MenuItemIconStyle: {
        position: 'absolute',
        right: 12
    }

});

export default ChooseLanguageScreen;