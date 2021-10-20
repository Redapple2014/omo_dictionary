import React, { useState, useRef, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
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
import { partofspeech } from '../../utills/userdata';
import { CheckBox } from 'react-native-elements';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

const TestCategoryScreen = (props) => {

    const [myData, setData] = useState([]);
    const { t, i18n } = useTranslation();
    const [editMode, setEditMode] = useState(true)
    const [categoryName, setCategoryName] = useState('')
    const [updated, setUpdated] = useState(false)
    const [items, setItems] = useState([]);

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

    //Function to check if the item is checked or not
    const isChecked = (itemId) => {
        try {
            const isThere = items.includes(itemId);
            return isThere;
        } catch (e) {
            console.log(e)
        }
    };

    //Function to toggle the item(check and uncheck)
    const toggleChecked = (itemId) => {
        const x = [itemId, ...items]

        if (isChecked(itemId)) {
            setItems(items.filter((id) => id !== itemId))
        } else {
            setItems(x)
        }
    }

    const renderItem = ({ item, index }) => {
        return (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            width: Sizes.WINDOW_WIDTH - 64,
                            backgroundColor: Constants.appColors.WHITE,
                            alignItems: 'center',
                            paddingVertical: 4,
                            flexDirection: 'row',
                            paddingHorizontal: 2,
                            marginVertical: 4,
                            marginHorizontal: 8,
                            borderRadius: 10,
                        }}>
                        <View>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{
                                fontWeight: '700',
                                color: Constants.appColors.BLACK,
                                fontSize: 18,
                                paddingLeft: 16,
                                width:Sizes.WINDOW_WIDTH-92
                            }}>{item?.doc?.name}</Text>
                            <Text style={{ paddingLeft: 16, marginVertical: 6 }}>{item?.doc?.cards.length}{` ${t("CardsText")}`}</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', right: 8 }}>
                        <CheckBox
                            checkedColor={Constants.appColors.PRIMARY_COLOR}
                            containerStyle={{ backgroundColor: Constants.appColors.TRANSPARENT, padding: 0, margin: 0 }}
                            size={20}
                            title=""
                            checkedIcon="check-square"
                            checked={isChecked(item?.id)}
                            uncheckedIcon='square'
                            uncheckedColor={Constants.appColors.LIGHTGRAY}
                            onPress={() => {toggleChecked(item?.id);setUpdated(true); setCategoryName(item.doc.name)}}
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
                    title={`Test Categories`}
                    leftIcon={`Settings`}
                    onPressleftIcon={goBack}
                />
            </View>
            <View style={{ flex: 1,marginTop:6 }}>
                {
                    myData.length > 0 ?
                        <FlatList
                            data={myData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${item.key}`}
                        />
                        : (<>
                            <Text style={{ textAlign: 'center', marginTop: 24 }}>{`${t("NoCategoryFoundText")}`}</Text>
                            <TouchableOpacity onPress={() => console.log('tap')}>
                                <Text style={{ textAlign: 'center', marginTop: 12, fontWeight: 'bold' }}>{`${t("CreateNewText")}`}</Text>
                            </TouchableOpacity></>
                        )
                }
            </View>
        </View>
    )
};

TestCategoryScreen.navigationOptions = {
    headerShown: false,
};

export default TestCategoryScreen;

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
