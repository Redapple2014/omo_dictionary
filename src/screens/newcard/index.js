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

const listOfpartofSpeech = ['감탄사', '관형사', '대명사', '동사', '명사', '보조 동사', '보조 형용사', '부사', '수사', '어미', '의존 명사', '접사', '조사', '품사 없음', '형용사']


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
    const [category, setCategory] = useState(pathFrom ? pathFrom?.doc?.name : `${t("SelectaCategoryText")}`);
    const [definitionsInputs, setDefinitionsInputs] = useState([{ key: '', value: '' }]);
    const [examplesInputs, setExamplesInputs] = useState([{ key: '', value: '' }]);
    const [catDetails, setCatDetails] = useState(pathFrom ? pathFrom : {})

    //fetch all flashcard data
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

//handel save flashcard data to a category
    const handleDone = () => {
        if (koreanHandWord.length > 0 && partOfSpeech.length > 0 && hanja.length > 0 && englishHandWord.length > 0 && definitionsInputs.length > 0 && examplesInputs.length > 0) {
            if (category !== `${t("SelectaCategoryText")}`) {
                if (definitionsInputs[0].value.length > 0 && examplesInputs[0].value.length > 0) {

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
                        const newObj = Object.assign({}, docObj, { "cards": [...doc.cards, newCardObject] })
                        console.log(JSON.stringify(newObj))
                        localDB.put(newObj).then((response) => {
                            console.log('responcen : ', response)
                            goBack()
                        }).catch((e) => console.log('ERORor: ', e))

                    }).catch(function (err) {
                        console.log('EROR : ', err);
                    });

                } else {
                    Toast.show(`${t("ProvideDefinitionExampleText")}`, Toast.SHORT)
                }
            } else {
                Toast.show(`${t("SelectaCategoryText")}`, Toast.SHORT)
            }
        } else {
            Toast.show(`${t("ProvideValidDetailsText")}`, Toast.SHORT)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    
//go back handeller
    const goBack = () => props.navigation.dispatch(NavigationActions.back())

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("NewCardText")}`}
                    leftIcon={`${t("CancelText")}`}
                    onPressleftIcon={goBack}
                    rightIcon={`    ${t("DoneText")}`}
                    onPressrightIcon={handleDone}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <CustomInput
                    label={`${t("KoreanHandwordText")}`}
                    ref={koreanHandWordRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder={`${t("KoreanHandwordPlaceholderText")}`}
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
                <View style={{ marginLeft: 12, marginTop: 36 }}><Text>{`${t("PartOfSpeechText")}`}</Text></View>
                <TouchableOpacity onPress={() => setPopOverlayActive(true)}>
                    <View style={{ height: 40, marginTop: 8, marginHorizontal: 12, backgroundColor: Constants.appColors.WHITE, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 4, color: Constants.appColors.GRAY }}>{partOfSpeech.length == 0 ? `${t("SelectPartSpeechText")}` : partOfSpeech}</Text>
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
                        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, marginBottom: 12 }}>{`${t("SelectPartSpeechText")}`}</Text>
                            <TouchableOpacity onPress={() => setPopOverlayActive(!isPoPOverlayActive)}>
                                <Icon name='closecircle' size={24} color={Constants.appColors.PRIMARY_COLOR} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            keyboardShouldPersistTaps={'handled'}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => { setPopOverlayActive(!isPoPOverlayActive); setPartOfSpeech(item) }}>
                                    <View style={{ borderWidth: .5,marginVertical:4,borderRadius:10,borderColor:Constants.appColors.LIGHTGRAY }}>
                                        <Text style={{ fontSize: 20, paddingLeft: 4, paddingVertical: 8 }}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            data={listOfpartofSpeech}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                        />

                    </View>
                </CustomPopup>
                <CustomInput
                    label={`${t("HanjaText")}`}
                    ref={hanjaRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder={`${t("EnterHanjaText")}`}
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
                    label={`${t("EnglishHandwordText")}`}
                    ref={englishHandWordRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder={`${t("EnglishHandwordPlaceholderText")}`}
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
                        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, marginBottom: 12 }}>{`${t("SelectCategoryText")}`}</Text>
                            <TouchableOpacity onPress={() => setOverlayActive(!isOverlayActive)}>
                                <Icon name='closecircle' size={24} color={Constants.appColors.PRIMARY_COLOR} />
                            </TouchableOpacity>
                        </View>
                        {
                            myData.length == 0 ? <View><Text style={{ textAlign: 'center' }}>{`${t("NodataFoundText")}`}</Text></View> :
                                <FlatList
                                    keyboardShouldPersistTaps={'handled'}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity onPress={() => { setCategory(item?.doc?.name); setCatDetails(item); setOverlayActive(!isOverlayActive); console.log(item) }}>
                                            <View style={{ borderWidth: .5,marginVertical:4,borderRadius:10,borderColor:Constants.appColors.LIGHTGRAY }}>
                                                <Text style={{ fontSize: 20, paddingLeft: 4, paddingVertical: 8 }}>{item?.doc?.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    data={myData}
                                    numColumns={1}
                                    showsVerticalScrollIndicator={false}
                                />
                        }
                    </View>
                </CustomPopup>
                <View style={{ marginLeft: 12, marginTop: 8 }}><Text>{`${t("DefinitionText")}`}</Text></View>
                {definitionsInputs.map((input, key) => (
                    <View style={styles.inputContainer} key={key}>
                        <TextInput placeholder={`${t("EnterSampleDefinitionText")} ${key + 1}`} value={input.value} onChangeText={(text) => inputHandler('d', text, key)} style />
                        <View style={{ position: 'absolute', right: 4 }}>
                            <TouchableOpacity onPress={() => deleteHandler('d', key)}>
                                <Icon name='minuscircle' size={19} color={Constants.appColors.RED} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', marginLeft: 12 }}>
                    <Text>{`${t("AddAnAdditionalDefinitionText")}`}</Text>
                    <View style={{ position: 'absolute', right: 20 }}>
                        <TouchableOpacity onPress={() => addHandler('d')}>
                            <Icon name='pluscircle' size={19} color={Constants.appColors.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginLeft: 12, marginTop: 8 }}><Text>{`${t("ExamplesText")}`}</Text></View>
                {examplesInputs.map((input, key) => (
                    <View style={styles.inputContainer} key={key}>
                        <TextInput placeholder={`${t("EnterSampleExamplesText")} ${key + 1}`} value={input.value} onChangeText={(text) => inputHandler('e', text, key)} style />
                        <View style={{ position: 'absolute', right: 4 }}>
                            <TouchableOpacity onPress={() => deleteHandler('e', key)}>
                                <Icon name='minuscircle' size={19} color={Constants.appColors.RED} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', marginLeft: 12 }}>
                    <Text>{`${t("AddAnAdditionalExample")}`}</Text>
                    <View style={{ position: 'absolute', right: 20 }}>
                        <TouchableOpacity onPress={() => addHandler('e')}>
                            <Icon name='pluscircle' size={19} color={Constants.appColors.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginLeft: 12, marginTop: 8 }}><Text>{`${t("CategoryText")}`}</Text></View>
                <TouchableOpacity onPress={() => setOverlayActive(true)}>
                    <View style={{ height: 40, marginTop: 8, marginBottom: 48, marginHorizontal: 12, backgroundColor: Constants.appColors.WHITE, justifyContent: 'center' }}>
                        <Text style={{ paddingLeft: 4, color: Constants.appColors.GRAY }}>{category}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
};

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
