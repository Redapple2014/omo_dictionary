import React, { useState, useRef, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Text, FlatList, TouchableOpacity, Switch } from 'react-native';
import CustomHeader from "../../components/header";
import Constants from '../../utills/Constants';
import { NavigationActions, NavigationEvents } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import CustomInput from "../../components/input/CustomInput";
import AntDesign from "react-native-vector-icons/AntDesign";
import Toast from 'react-native-simple-toast';
import PouchDB from 'pouchdb-react-native';
import CustomPopup from '../../components/popup/CustomPopup';
import Sizes from '../../utills/Size';
import { forntDisplay } from '../../utills/userdata';
import { CheckBox } from 'react-native-elements';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

const FrontDisplayScreen = (props) => {

    const [myData, setData] = useState([]);
    const { t, i18n } = useTranslation();
    const [updated, setUpdated] = useState(false);
    const [koreanHandword,setKoreanHandword] = useState(true);
    const [hanjaHandword,setHanjaHandword] = useState(true);
    const [partofspeech,setPartofspeech] = useState(true);
    const [audio,setAudio] = useState(true);
    const [definition,setDefinition] = useState(true);

    
    //go back handeller
    const goBack = () => props.navigation.dispatch(NavigationActions.back())

    async function fetchData() {
        localDB.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                    setData([]);
                    return console.log(err);
                }
                // handle result
                setData(response.rows);
                // console.log("fetched data ", response.rows)
                return response.rows;

            },
        );
    }

    const toggleSwitch = (id) => {
        if (id == 1) {
            setKoreanHandword(previousState => !previousState)
            setUpdated(true)

        }
        else if (id == 2) {
            setHanjaHandword(previousState => !previousState)
            setUpdated(true)

        }
        else if (id == 3) {
            setPartofspeech(previousState => !previousState)
            setUpdated(true)

        }
        else if (id == 4) {
            setAudio(previousState => !previousState)
            setUpdated(true)

        }else if (id == 5) {
            setDefinition(previousState => !previousState)
            setUpdated(true)

        }

    };

    const renderItem = ({ item, index }) => {
        return (
                    <View
                        style={{
                            width: Sizes.WINDOW_WIDTH - 32,
                            backgroundColor: Constants.appColors.WHITE,
                            alignItems: 'center',
                            paddingVertical: 4,
                            flexDirection: 'row',
                            paddingHorizontal:2,
                            borderBottomColor:Constants.appColors.LIGHTGRAY,
                            borderBottomWidth: index == forntDisplay.length-1 ? 0 : .5,
                            marginHorizontal: 8,
                            borderRadius: 10,
                            height:52
                        }}>
                            <Text style={{
                                fontWeight: '700',
                                color: Constants.appColors.BLACK,
                                fontSize: 18,
                                paddingLeft: 16
                            }}>{item.name}</Text>
                 
                 <View style={{ position: 'absolute', right: 8 }}>
                 <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => {toggleSwitch(item.id); setUpdated(true)}}
                            value={item.value}
                        />
                 </View>
</View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents onDidFocus={(payload) => { fetchData(); }} />
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`Front Display`}
                    leftIcon={`Settings`}
                    onPressleftIcon={goBack}
                />
            </View>
            <View style={{ flex: 1 }}>
            {
                    forntDisplay.length > 0 &&
(                    <View style={{borderRadius:20,marginTop:8,marginHorizontal:8,padding:4,alignItems:'center', backgroundColor:Constants.appColors.WHITE}}>
                    <FlatList
                        data={forntDisplay}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.id}`}
                    />
                    </View>)
                }
                
            </View>
        </View>
    )
};

FrontDisplayScreen.navigationOptions = {
    headerShown: false,
};

export default FrontDisplayScreen;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: "lightgray",
        marginHorizontal: 16,
        backgroundColor: Constants.appColors.WHITE,
        marginVertical: 4
    }
});
