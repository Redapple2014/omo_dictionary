import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import PouchDB from 'pouchdb-react-native';
import Constants from '../../../utills/Constants';
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationActions } from 'react-navigation';
import { NavigationEvents } from 'react-navigation';
import Sizes from '../../../utills/Size'
import MIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from "react-native-vector-icons/AntDesign";
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

const FlashcardListRenderScreen = (props) => {

    const [myData, setData] = useState([]);
    const [editMode, setEditMode] = useState(false)
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

        const renderItem = ({ item, index, move, moveEnd, isActive }) => {
            return (
                <TouchableOpacity
                    onPress={()=>{}}
                    onLongPress={move}
                    onPressOut={moveEnd}>
                    <View key ={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                width: editMode ? Sizes.WINDOW_WIDTH - 48 : Sizes.WINDOW_WIDTH,
                                backgroundColor: isActive ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.WHITE,
                                alignItems: 'center',
                                paddingVertical: 8,
                                flexDirection: 'row',
                                borderBottomWidth: 0.5,
                                borderBottomColor: Constants.appColors.LIGHTGRAY
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
                                fontSize: 20,
                                paddingLeft: editMode ? 48 : 28
                            }}>{item?.doc?.name}</Text>
                            <Text style={{paddingLeft: editMode ? 48 : 28}}>{item?.doc?.cards.length} cards</Text>
                            </View>  
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <MIcons name="view-headline" size={22} color={Constants.appColors.PRIMARY_COLOR} />
                        </View>
                        {/* {
                            !editMode && <View style={{position:'absolute',right:16}}><AntDesign name='checkcircle' color={Constants.appColors.PRIMARY_COLOR} size={20}/></View>
                        } */}
                    </View>
                </TouchableOpacity>
            )
        }


    return (
        <View style={{flex:1}}>
            <NavigationEvents onDidFocus={(payload) => fetchData()}/>
                        <View style={styles.container}>
                <View style={{ width: 100, left: 0, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.dispatch(NavigationActions.back())}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chevron-back-sharp' size={20} color={Constants.appColors.WHITE} />
                            <Text style={{ fontSize: 16, color: 'white' }}>Flashcards</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textStyle}>Default Category</Text>
            </View>
            <View style={{flex:1}}>
            <FlatList
                            data={myData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `draggable-item-${item.key}`}
                        />
            </View>
        </View>
    )
}


FlashcardListRenderScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardListRenderScreen;


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
    },
    textStyle2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Constants.appColors.BLACK,
        width: '67%'
    },
    itemStyle:{
        justifyContent: 'center',
        borderBottomWidth:.5,
        paddingVertical:8,
        borderBottomColor:Constants.appColors.LIGHTGRAY
    }

});