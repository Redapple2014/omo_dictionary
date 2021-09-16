import React, { useState, useRef, useEffect } from 'react';
import { View, StatusBar, StyleSheet, TextInput, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import CustomHeader from "../../components/header";
import Constants from '../../utills/Constants';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import CustomInput from "../../components/input/CustomInput";
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import PouchDB from 'pouchdb-react-native';
import CustomPopup from '../../components/popup/CustomPopup';
import Sizes from '../../utills/Size';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

const listOfpartofSpeech = ['감탄사','관형사','대명사','동사','명사','보조 동사','보조 형용사','부사','수사','어미','의존 명사','접사','조사','품사 없음','형용사']


const NewCardScreen = (props) => {

    const pathFrom = props.navigation.getParam('path', '');

    // console.log('path data : ',pathFrom)

    const [isOverlayActive, setOverlayActive] = useState(false);
    const [isPoPOverlayActive, setPopOverlayActive] = useState(false);
    const [myData, setData] = useState([]);
    const { t, i18n } = useTranslation();
    const koreanHandWordRef = useRef(null);
    const partOfSpeechRef = useRef(null);
    const hanjaRef = useRef(null);
    const englishHandWordRef = useRef(null);
    const [koreanHandWord, setKoreanHandWord] = useState('');
    const [partOfSpeech, setPartOfSpeech] = useState('');
    const [hanja, setHanja] = useState('');
    const [englishHandWord, setEnglishHandWord] = useState('');
    const [category, setCategory] = useState(pathFrom ?  pathFrom?.doc?.name : "Please select a category");
    const [definitionsInputs, setDefinitionsInputs] = useState([{ key: '', value: '' }]);
    const [examplesInputs, setExamplesInputs] = useState([{ key: '', value: '' }]);
    const [catDetails,setCatDetails] = useState(pathFrom?pathFrom:{})

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
                //console.log("fetched data ", response.rows)
                return response.rows;

            },
        );
    }

    //add dynamic input
    const addHandler = (type) => {
        if (type == 'd') {
            const _inputs = [...definitionsInputs];
            _inputs.push({ key: '', value: '' });
            setDefinitionsInputs(_inputs);
        } else {
            const _input = [...examplesInputs];
            _input.push({ key: '', value: '' });
            setExamplesInputs(_input);
        }
    }

    //delete dynamic input
    const deleteHandler = (type, key) => {
        if (type == 'd') {
            const _inputs = definitionsInputs.filter((input, index) => index != key);
            setDefinitionsInputs(_inputs);
        } else {
            const _input = examplesInputs.filter((input, index) => index != key);
            setExamplesInputs(_input);
        }
    }

    //handle dynamic input for each inputs
    const inputHandler = (type, text, key) => {
        if (type == 'd') {
            const _inputs = [...definitionsInputs];
            _inputs[key].value = text;
            _inputs[key].key = key;
            setDefinitionsInputs(_inputs);
        } else {
            const _input = [...examplesInputs];
            _input[key].value = text;
            _input[key].key = key;
            setExamplesInputs(_input);
        }
    }


    const handleDone = () => {
        //console.log('CAT: ',category)
        if (koreanHandWord.length > 0 && partOfSpeech.length > 0 && hanja.length > 0 && englishHandWord.length > 0 && definitionsInputs.length > 0 && examplesInputs.length > 0) {
           if(category !== 'Please select a category'){
            if (definitionsInputs[0].value.length>0 && examplesInputs[0].value.length>0 ) {

                localDB.get(catDetails.id).then(function (doc) {
                    // console.log(doc)
                    const docObj = doc
                    const newCardObject = {
                        "koreanHeadWord": koreanHandWord,
                        "speech": partOfSpeech,
                        "hanja": hanja,
                        "englishHeadWord": englishHandWord,
                        "definition": definitionsInputs,
                        "examples": examplesInputs,
                    }
                    const newObj = Object.assign({},docObj,{"cards":[...doc.cards,newCardObject]})
                    console.log(JSON.stringify(newObj))
                    localDB.put(newObj).then((response)=>{
                        console.log('responcen : ',response)
                        goBack()
                    }).catch((e)=>console.log('ERORor: ',e))

                }).catch(function (err) {
                    console.log('EROR : ',err);
                });

            } else {
                Toast.show('Please provide definition & example', Toast.SHORT)
            }
        }else{
            Toast.show('Please select a category', Toast.SHORT)
        }
        } else {
            Toast.show('Please provide valid details', Toast.SHORT)
        }
    }

    useEffect(() => {
        fetchData()

    }, [])

    const goBack = () => props.navigation.dispatch(NavigationActions.back())

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("NewCardText")}`}
                    leftIcon={`${t("CancelText")}`}
                    onPressleftIcon={goBack}
                    rightIcon={`${t("DoneText")}`}
                    onPressrightIcon={handleDone}
                />
            </View>
            <ScrollView style={{ flex: 1 }}>
                <CustomInput
                    label='Korean Handword'
                    ref={koreanHandWordRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter the korean handword'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={1}
                    containerStyle={{ height: 40, marginTop: 8 }}
                    value={koreanHandWord}
                    onChangeText={
                        value => {
                            setKoreanHandWord(value);
                        }
                    }
                    onSubmitEditing={() => partOfSpeechRef.current.focus()}
                />
                <View style={{ marginLeft: 12, marginTop: 36 }}><Text>Part of speech</Text></View>
                <TouchableOpacity onPress={() => setPopOverlayActive(true)}>
                    <View style={{ height: 40, marginTop: 8, marginHorizontal: 12, backgroundColor: Constants.appColors.WHITE, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 4, color: Constants.appColors.GRAY }}>{partOfSpeech.length == 0 ? `Select a part of speech` : partOfSpeech}</Text>
                    </View>
                </TouchableOpacity>
                <CustomPopup
                    visible={isPoPOverlayActive}
                    onRequestClose={() => setPopOverlayActive(!isPoPOverlayActive)}
                    transparent={true}
                    animationType='fade'
                    modalContainerStyle={{
                        height: Sizes.WINDOW_HEIGHT, backgroundColor: 'white',
                        width: '100%',
                        maxHeight: Sizes.WINDOW_HEIGHT * .5
                    }}
                >
                    <View style={{ paddingHorizontal: 12, paddingTop: 8, flex: 1 }}>
                        <Text style={{ fontSize: 16,marginBottom:12 }}>Select Part Of Speech</Text>
                        <ScrollView>
                        <FlatList
                            keyboardShouldPersistTaps={'handled'}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={()=>{setPopOverlayActive(!isPoPOverlayActive);setPartOfSpeech(item)}}>
                                <View style={{borderWidth:.5}}>
                                    <Text style={{fontSize:20,paddingLeft:4,paddingVertical:8}}>{item}</Text>
                                </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            data={listOfpartofSpeech}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                        />
                        </ScrollView>
                    </View>
                </CustomPopup>
                <CustomInput
                    label='Hanja'
                    ref={hanjaRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter the corrosponding hanja'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={1}
                    containerStyle={{ height: 40, marginTop: 8 }}
                    value={hanja}
                    onChangeText={
                        value => {
                            setHanja(value);
                        }
                    }
                    onSubmitEditing={() => englishHandWordRef.current.focus()}
                />
                <CustomInput
                    label='English Handword'
                    ref={englishHandWordRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter the english handword'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={1}
                    containerStyle={{ height: 40, marginVertical: 36 }}
                    value={englishHandWord}
                    onChangeText={
                        value => {
                            setEnglishHandWord(value);
                        }
                    }
                    onSubmitEditing={() => { }}
                />
                <CustomPopup
                    visible={isOverlayActive}
                    onRequestClose={() => setOverlayActive(!isOverlayActive)}
                    transparent={true}
                    animationType='fade'
                    modalContainerStyle={{
                        height: Sizes.WINDOW_HEIGHT, backgroundColor: 'white',
                        width: '100%',
                        maxHeight: Sizes.WINDOW_HEIGHT * .5
                    }}
                >
                    <View style={{ paddingHorizontal: 12, paddingTop: 8, flex: 1 }}>
                        <Text style={{ fontSize: 16,marginBottom:12 }}>Select Category</Text>
                        {/* render the catagory available */}
                        <FlatList
                            keyboardShouldPersistTaps={'handled'}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={()=>{setCategory(item?.doc?.name);setCatDetails(item);setOverlayActive(!isOverlayActive);console.log(item)}}>
                                <View style={{borderWidth:.5}}>
                                    <Text style={{fontSize:20,paddingLeft:4,paddingVertical:8}}>{item?.doc?.name}</Text>
                                </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            data={myData}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                        />

                    </View>
                </CustomPopup>
                <View style={{ marginLeft: 12, marginTop: 8 }}><Text>Definition</Text></View>
                {definitionsInputs.map((input, key) => (
                    <View style={styles.inputContainer} key={key}>
                        <TextInput placeholder={`Enter sample definition ${key + 1}`} value={input.value} onChangeText={(text) => inputHandler('d', text, key)} style />
                        <TouchableOpacity onPress={() => deleteHandler('d', key)}>
                            <Icon name='minuscircle' size={19} color={Constants.appColors.RED} />
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', marginLeft: 12 }}>
                    <Text>Add an additional definition</Text>
                    <View style={{ position: 'absolute', right: 16 }}>
                        <TouchableOpacity onPress={() => addHandler('d')}>
                            <Icon name='pluscircle' size={19} color={Constants.appColors.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginLeft: 12, marginTop: 8 }}><Text>Examples</Text></View>
                {examplesInputs.map((input, key) => (
                    <View style={styles.inputContainer} key={key}>
                        <TextInput placeholder={`Enter sample examples ${key + 1}`} value={input.value} onChangeText={(text) => inputHandler('e', text, key)} style />
                        <TouchableOpacity onPress={() => deleteHandler('e', key)}>
                            <Icon name='minuscircle' size={19} color={Constants.appColors.RED} />
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', marginLeft: 12 }}>
                    <Text>Add an additional example</Text>
                    <View style={{ position: 'absolute', right: 16 }}>
                        <TouchableOpacity onPress={() => addHandler('e')}>
                            <Icon name='pluscircle' size={19} color={Constants.appColors.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginLeft: 12, marginTop: 8 }}><Text>Category</Text></View>
                <TouchableOpacity onPress={() => setOverlayActive(true)}>
                    <View style={{ height: 40, marginTop: 8, marginBottom: 48, marginHorizontal: 12, backgroundColor: Constants.appColors.WHITE, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 4, color: Constants.appColors.GRAY }}>{category}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )};

NewCardScreen.navigationOptions = {
  headerShown: false,
};

export default NewCardScreen;

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
