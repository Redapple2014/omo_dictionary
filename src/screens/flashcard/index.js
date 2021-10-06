import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from "../../components/header";
import {
    NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH
} from '../../navigations/Routes';
import { useTranslation } from 'react-i18next';
import EIcons from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';
import Dialog from "react-native-dialog";
import {
    NAVIGATION_NEW_CARD_SCREEN_PATH,
    NAVIGATION_DISPLAY_CARD_SCREEN_PATH
} from '../../navigations/Routes';
import Toast from 'react-native-simple-toast';
import { CheckBox } from 'react-native-elements';
import PouchDB from 'pouchdb-react-native';
import { NavigationEvents } from 'react-navigation';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

// const data = [
//     {
//         key: 1,
//         backgroundColor: '#123456',
//     },
//     {
//         key: 2,
//         backgroundColor: '#1AC456',
//     },
//     {
//         key: 3,
//         backgroundColor: '#1256BC',
//     },
//     {
//         key: 4,
//         backgroundColor: '#12fdBC',
//     },
//     {
//         key: 5,
//         backgroundColor: '#1876BC',
//     }

// ]


const FlashcardScreen = (props) => {


    const [myData, setData] = useState([]);
    const { t, i18n } = useTranslation();
    const [editMode, setEditMode] = useState(false)
    const [visible, setVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('')
    const [items, setItems] = useState([]);


    //insert category function handeller
    async function insert() {
        localDB
            .find({
                selector: {
                    'name': { $eq: `${newCategoryName}` },
                },
                limit: 20,
            })
            .then(function (result) {
               // console.log(result.docs)
                if (result.docs.length > 0) {
                    Toast.show('Category already exist', Toast.SHORT)
                } else {
                    insertData()
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }


//insert function to create a new category
    async function insertData() {
        const json = {
            "category": "flashcard",
            "name": newCategoryName,
            "type": newCategoryName,
            "cards": []
        }
        await localDB
            .post(json)
            .then(function (result) { console.log('Row inserted Successfully');
            })
            .catch(function (err) {
                console.log('err=======', err);
                //setLoading(false);
                console.log(
                    'Unable to insert into DB. Error: ' + err.name + ' - ' + err.message,
                );
            });
        fetchData()
    }

    //fetch function
    async function fetchData() {
        localDB.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                    return console.log(err);
                }
                // handle result
                setData(response.rows);
               // console.log("fetched data ", response.rows)
                return response.rows;

            },
        );
    }

    //dalete data function
    async function deleteData() {

        items.map((item) => {
            localDB.get(item).then(function (doc) {
                localDB.remove(doc["_id"], doc["_rev"], function (err) {
                    if (err) {
                        return console.log(err);
                    } else {
                        console.log("Document deleted successfully");
                        fetchData()
                    }
                });
            }).catch(function (err) {
                console.log(err);
            });
        })
        setItems([])
    }




//render each category with drag feature
    const renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
            <TouchableOpacity
                onPress={() => !editMode && props.navigation.navigate(NAVIGATION_DISPLAY_CARD_SCREEN_PATH,{data:item})
                }
                onLongPress={move}
                onPressOut={moveEnd}>
                <View key ={index} style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    backgroundColor: 'white',
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                    marginVertical: 4,
                    marginHorizontal: 8,
                    borderRadius: 10,
                    }}>
                    <View
                        style={{
                            width: editMode ? Sizes.WINDOW_WIDTH - 64 : Sizes.WINDOW_WIDTH-30,
                            backgroundColor: isActive ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.WHITE,
                            alignItems: 'center',
                            paddingVertical: 8,
                            flexDirection: 'row',
                        }}>
                        {
                            editMode &&
                            <View style={{ position: 'absolute', left: 0 }}>
                                <CheckBox
                                    checkedColor={Constants.appColors.PRIMARY_COLOR}
                                    containerStyle={{ backgroundColor: Constants.appColors.TRANSPARENT, zIndex: 4 }}
                                    size={20}
                                    title=""
                                    checkedIcon="check-square"
                                    uncheckedIcon="square"
                                    checked={isChecked(item?.id)}
                                    onPress={() => toggleChecked(item?.id)}
                                />
                            </View>
                        }
                        <View>
                        <Text style={{
                            fontWeight: '700',
                            color: Constants.appColors.BLACK,
                            fontSize: 18,
                            paddingLeft: editMode ? 48 : 28
                        }}>{item?.doc?.name}</Text>
                        <Text style={{paddingLeft: editMode ? 48 : 28,paddingVertical:4}}>{item?.doc?.cards.length} {`${t("CardsText")}`}</Text>
                        </View>  
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <MIcons name="view-headline" size={22} color={Constants.appColors.PRIMARY_COLOR} />
                    </View>
                    {
                        !editMode && <View style={{position:'absolute',right:16}}><AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={20}/></View>
                    }
                </View>

            </TouchableOpacity>
        )
    }


//Show dialog popup
    const showDialog = () => {
        setVisible(true);
    };

//handel cancel function from dialog input
    const handleCancel = () => {
        setNewCategoryName('')
        setVisible(false);
    };


//handel delete button 
    const handleDelete = () => {
        if (items.length == 0) {
            Toast.show('Selet a item to delete', Toast.SHORT);
        } else {
            deleteData()
        }
    }


//handel save function from dialog input
    const handleSave = () => {
        if (newCategoryName.length > 0) {
            console.log('name : ', newCategoryName)
            setVisible(false);
            setNewCategoryName('')
            insert()
        } else {
            Toast.show(`${t("InputEmptyText")}`, Toast.SHORT);
        }
    };

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

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents onDidFocus={(payload) => fetchData()}/>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <View style={styles.container}>
                    {
                        editMode && <View style={{ padding: 6, alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', left: 0 }}>
                            <TouchableOpacity onPress={() => { console.log('edit cancel'); setEditMode(!editMode) }}>
                                <Text style={{ fontSize: 20, color: 'white' }}>{`${t("CancelText")}`}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <Text style={[styles.textStyle]}>{`${t("FlashcardPageTitle")}`}</Text>
                    <View style={{ padding: 6, alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', right: 0 }}>
                        {
                            !editMode ? <>
                                <TouchableOpacity onPress={showDialog}>
                                    <FA5Icons name="folder-plus" size={23} color={Constants.appColors.WHITE} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => props.navigation.navigate(NAVIGATION_NEW_CARD_SCREEN_PATH)}>
                                    <View style={{ marginHorizontal: 12 }}>
                                        <MIcons name="insert-drive-file" size={23} color={Constants.appColors.WHITE} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    console.log('edit press')
                                    setEditMode(!editMode)
                                }}>
                                    <MIcons name="edit" size={23} color={Constants.appColors.WHITE} />
                                </TouchableOpacity></>
                                :
                                <>
                                    <TouchableOpacity onPress={handleDelete}>
                                        <View style={{ marginHorizontal: 12 }}>
                                            <MIcons name="delete" size={23} color={Constants.appColors.WHITE} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        console.log('save press')
                                        setEditMode(!editMode)
                                    }}>
                                        <MIcons name="check" size={24} color={Constants.appColors.WHITE} />
                                    </TouchableOpacity>
                                </>
                        }
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {
                    editMode ?
                        <DraggableFlatList
                            data={myData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `draggable-item-${item.key}`}
                            scrollPercent={5}
                            onMoveEnd={({ data }) => setData(data)}
                        />
                        :
                        <FlatList
                            data={myData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `draggable-item-${item.key}`}
                        />
                }
                {
                    myData.length == 0 && <Text style={{ position: 'absolute', top: Sizes.WINDOW_HEIGHT * .35 - 32, left: Sizes.WINDOW_WIDTH / 2 - 64 }}>No Flash Card Found</Text>
                }
                {visible &&
                    <Dialog.Container visible={visible}>
                        <Dialog.Title>{`${t("EnterNewCategoryNameText")}`}</Dialog.Title>
                        <Dialog.Input value={newCategoryName} onChangeText={(v) => setNewCategoryName(v)} />
                        <Dialog.Button label={`${t("CancelText")}`} onPress={handleCancel} />
                        <Dialog.Button label={`${t("SaveText")}`} onPress={handleSave} />
                    </Dialog.Container>
                }
            </View>
        </View>
    )
}

FlashcardScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: Constants.appColors.PRIMARY_COLOR,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        flexDirection: 'row'
    },
    textStyle: {
        color: Constants.appColors.WHITE,
        fontSize: 20,
        marginLeft: 8,
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    addressContainer: { justifyContent: 'space-between', flexDirection: 'row', marginBottom: 6, paddingRight: 8 }
})