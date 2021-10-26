import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CustomHeader from '../../components/header';
import Constants from '../../utills/Constants';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useTranslation } from 'react-i18next';
import CustomInput from '../../components/input/CustomInput';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import PouchDB from 'pouchdb-react-native';
import CustomPopup from '../../components/popup/CustomPopup';
import Sizes from '../../utills/Size';
import { partofspeech, listOfpartofSpeechArr } from '../../utills/userdata';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');



const NewCardScreen = (props) => {
  const pathFrom = props.navigation.getParam('path', '');
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
  const [definitionsInputs, setDefinitionsInputs] = useState('');
  const [category, setCategory] = useState(
    pathFrom.length== 0 ?'Uncategorized' :  pathFrom?.name,
  );
  const [examplesInputs, setExamplesInputs] = useState([{ key: '', value: '' }]);
  const [catDetails, setCatDetails] = useState('');

  //fetch all flashcard data
  async function fetchData() {
    const query = `SELECT categories.id, categories.name, categories.type, categories.cat_order, 
        JSON_GROUP_ARRAY(json_object('id', cards.id, 
                                      'word_id', cards.word_id,
                                      'speech', cards.speech,
                                      'hanja', cards.hanja,
                                      'englishHeadWord', cards.englishHeadWord,
                                      'definition', cards.definition,
                                      'examples', cards.examples,
                                      'koreanHeadWord',cards.koreanHeadWord,
                                      'card_order', cards.card_order)) 
        AS allCards
    FROM categories
    LEFT JOIN cards on categories.id = cards.category_id
    GROUP BY categories.id
    order by categories.cat_order`;
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        // console.log('len : ' ,len);
        var temp = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          row.cards = JSON.parse(row.allCards);
          row.cards = row.cards.filter((item) => item.id != null);
          temp.push(row);
        }
        // console.log('temp : ',temp)
        setData(temp);
      });
    });
  }

  async function getCatdata() {

    let query = '';
    if(category != 'undefined'){
      query = `SELECT * FROM categories WHERE name = '${category}'`;
    }else{
      query = `SELECT * FROM categories WHERE name = 'Uncategorized'`;
    }
      db.transaction((tx) => {
        tx.executeSql(query, [], (tx, results) => {
          var item = results.rows.raw(0)[0];
          console.log('getCatdata : ' ,item);
          setCatDetails(item)
          // console.log('set the item : ',item)
        });
      });

  }
  useEffect(()=>{
    getCatdata()
  },[category])

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
  };

  //delete dynamic input
  const deleteHandler = (type, key) => {
    if (type == 'd') {
      const _inputs = definitionsInputs.filter((input, index) => index != key);
      setDefinitionsInputs(_inputs);
    } else {
      const _input = examplesInputs.filter((input, index) => index != key);
      setExamplesInputs(_input);
    }
  };

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
  };

  useEffect(() => {
    // checkInit();
    fetchData()
  }, []);


  function insertCard(
    word_id,
    category_id,
    speech,
    hanja,
    englishHeadWord,
    definition,
    examples,
    koreanHeadWord,
    card_order,
  ) {
    console.log('indert data : ',word_id,
      category_id,
      speech,
      hanja,
      englishHeadWord,
      definition,
      examples,
      koreanHeadWord,
      card_order)

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO cards (word_id, category_id, speech,hanja, englishHeadWord, definition, examples, koreanHeadWord, card_order) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          word_id,
          category_id,
          speech,
          hanja,
          englishHeadWord,
          definition,
          JSON.stringify(examples),
          koreanHeadWord,
          card_order,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            goBack();
          } else {
            alert('Create card Failed');
          }
        },
      );
    });
  }

  //handel save flashcard data to a category
  const handleDone = () => {
    if (koreanHandWord.length > 0 && englishHandWord.length > 0) {
      console.log(catDetails,"********")
      if (category !== `${t('SelectaCategoryText')}`) {
        insertCard(
          null,
          catDetails.id,
          partOfSpeech,
          hanja,
          englishHandWord,
          definitionsInputs,
          examplesInputs,
          koreanHandWord,
          1,
        );

        // localDB.get(catDetails.id).then(function (doc) {
        //     // console.log(doc)
        //     const docObj = doc
        //     const newCardObject = {
        //         "koreanHeadWord": koreanHandWord,
        //         "speech": partOfSpeech,
        //         "hanja": hanja,
        //         "englishHeadWord": englishHandWord,
        //         "definition": definitionsInputs,
        //         "examples": examplesInputs,
        //     }
        //     const newObj = Object.assign({}, docObj, { "cards": [...doc.cards, newCardObject] })
        //     console.log(JSON.stringify(newObj))
        //     localDB.put(newObj).then((response) => {
        //         //console.log('responcen : ', response)
        //         goBack()
        //     }).catch((e) => console.log('ERORor: ', e))
        // }).catch(function (err) {
        //     console.log('EROR : ', err);
        // });
      } else {
        Toast.show(`${t('SelectaCategoryText')}`, Toast.SHORT);
      }
    } else {
      Toast.show(`${t('ProvideValidDetailsText')}`, Toast.SHORT);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  //go back handeller
  const goBack = () => props.navigation.dispatch(NavigationActions.back());

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: Constants.appColors.PRIMARY_COLOR,
          paddingTop: Platform.OS == 'ios' ? getStatusBarHeight() : 0,
        }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.appColors.PRIMARY_COLOR}
        />
        <CustomHeader
          title={`${t('NewCardText')}`}
          leftIcon={`${t('CancelText')}`}
          onPressleftIcon={goBack}
          rightIcon={`    ${t('DoneText')}`}
          onPressrightIcon={handleDone}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <CustomInput
          label={`${t('KoreanHandwordText')}*`}
          ref={koreanHandWordRef}
          labelStyle={{
            fontSize: 13,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          placeholder={`${t('KoreanHandwordPlaceholderText')}`}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
          }}
          keyboardType="email-address"
          leftIconContainerStyle={{ marginRight: 16 }}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={1}
          containerStyle={{ height: 30, marginTop: 8 }}
          value={koreanHandWord}
          onChangeText={(value) => {
            setKoreanHandWord(value);
          }}
          onSubmitEditing={() => hanjaRef.current.focus()}
        />
        <View style={{ marginLeft: 12, marginTop: 48 }}>
          <Text>{`${t('PartOfSpeechText')}`}</Text>
        </View>
        <TouchableOpacity onPress={() => setPopOverlayActive(true)}>
          <View
            style={{
              height: 48,
              borderRadius: 6,
              marginTop: 8,
              marginHorizontal: 12,
              backgroundColor: Constants.appColors.WHITE,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                paddingLeft: 4,
                fontSize: 18,
                color:
                  partOfSpeech.length == 0
                    ? Constants.appColors.LIGHTGRAY
                    : Constants.appColors.BLACK,
              }}>
              {partOfSpeech.length == 0
                ? `${t('SelectPartSpeechText')}`
                : ` ${partOfSpeech}`}
            </Text>
          </View>
        </TouchableOpacity>
        <CustomPopup
          visible={isPoPOverlayActive}
          onRequestClose={() => setPopOverlayActive(!isPoPOverlayActive)}
          transparent={true}
          animationType="fade"
          modalContainerStyle={{
            height: Sizes.WINDOW_HEIGHT,
            backgroundColor: 'white',
            width: '100%',
            maxHeight: Sizes.WINDOW_HEIGHT * 0.5,
          }}>
          <View
            style={{
              paddingHorizontal: 12,
              paddingTop: 8,
              flex: 1,
              marginBottom: 12,
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, marginBottom: 12 }}>{`${t(
                'SelectPartSpeechText',
              )}`}</Text>
              <TouchableOpacity
                onPress={() => setPopOverlayActive(!isPoPOverlayActive)}>
                <Icon
                  name="closecircle"
                  size={24}
                  color={Constants.appColors.PRIMARY_COLOR}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setPopOverlayActive(!isPoPOverlayActive);
                    setPartOfSpeech(partofspeech[item]);
                  }}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      marginVertical: 4,
                      borderRadius: 6,
                      borderColor: Constants.appColors.LIGHTGRAY,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        paddingLeft: 16,
                        paddingVertical: 8,
                      }}>
                      {partofspeech[item]}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              data={listOfpartofSpeechArr}
              numColumns={1}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </CustomPopup>
        <CustomInput
          label={`${t('HanjaText')}`}
          ref={hanjaRef}
          labelStyle={{
            fontSize: 13,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          placeholder={`${t('EnterHanjaText')}`}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
          }}
          keyboardType="email-address"
          leftIconContainerStyle={{ marginRight: 16 }}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={1}
          containerStyle={{ height: 40, marginTop: 8 }}
          value={hanja}
          onChangeText={(value) => {
            setHanja(value);
          }}
          onSubmitEditing={() => englishHandWordRef.current.focus()}
        />
        <CustomInput
          label={`${t('EnglishHandwordText')}*`}
          ref={englishHandWordRef}
          labelStyle={{
            fontSize: 13,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          placeholder={`${t('EnglishHandwordPlaceholderText')}`}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
          }}
          keyboardType="email-address"
          leftIconContainerStyle={{ marginRight: 16 }}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={1}
          containerStyle={{ height: 40, marginVertical: 36 }}
          value={englishHandWord}
          onChangeText={(value) => {
            setEnglishHandWord(value);
          }}
          onSubmitEditing={() => { }}
        />
        <CustomPopup
          visible={isOverlayActive}
          onRequestClose={() => setOverlayActive(!isOverlayActive)}
          transparent={true}
          animationType="fade"
          modalContainerStyle={{
            height: Sizes.WINDOW_HEIGHT,
            backgroundColor: 'white',
            width: '100%',
            maxHeight: Sizes.WINDOW_HEIGHT * 0.5,
          }}>
          <View style={{ paddingHorizontal: 12, paddingTop: 8, flex: 1 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, marginBottom: 12 }}>{`${t(
                'SelectCategoryText',
              )}`}</Text>
              <TouchableOpacity
                onPress={() => setOverlayActive(!isOverlayActive)}>
                <Icon
                  name="closecircle"
                  size={24}
                  color={Constants.appColors.PRIMARY_COLOR}
                />
              </TouchableOpacity>
            </View>
            {myData.length == 0 ? (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ textAlign: 'center' }}>{`${t(
                  'NodataFoundText',
                )}`}</Text>
              </View>
            ) : (
              <FlatList
                keyboardShouldPersistTaps={'handled'}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      console.log(item)
                      setCategory(item?.name);
                      setCatDetails(item);
                      setOverlayActive(!isOverlayActive);
                    }}>
                    <View
                      style={{
                        borderWidth: 0.5,
                        marginVertical: 4,
                        borderRadius: 6,
                        borderColor: Constants.appColors.LIGHTGRAY,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          paddingLeft: 16,
                          paddingVertical: 8,
                        }}>
                        {item?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                data={myData}
                numColumns={1}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </CustomPopup>
        {/* <View style={{ marginLeft: 12, marginTop: 8 }}><Text>{`${t("DefinitionText")}`}</Text></View> */}
        <CustomInput
          label={`${t('DefinitionText')}`}
          ref={englishHandWordRef}
          labelStyle={{
            fontSize: 13,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          placeholder={`${t('EnterSampleDefinitionText')}`}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
          }}
          keyboardType="email-address"
          leftIconContainerStyle={{ marginRight: 16 }}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={1}
          containerStyle={{ height: 40, marginTop: 8 }}
          value={definitionsInputs}
          onChangeText={(value) => {
            setDefinitionsInputs(value);
          }}
          onSubmitEditing={() => { }}
        />
        {/* {definitionsInputs.map((input, key) => (
                    <View style={[styles.inputContainer,{height: 48,borderRadius:6,}]} key={key}>
                        <TextInput placeholder={` ${t("EnterSampleDefinitionText")} ${key + 1}`} value={input.value} onChangeText={(text) => inputHandler('d', text, key)} style={{fontSize:17}} placeholderTextColor={Constants.appColors.LIGHTGRAY}  />
                        <View style={{ position: 'absolute', right: 4 }}>
                            <TouchableOpacity onPress={() => deleteHandler('d', key)}>
                                <Icon name='minuscircle' size={19} color={Constants.appColors.RED} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))} */}
        {/* <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', marginLeft: 12 }}>
                    <Text>{`${t("AddAnAdditionalDefinitionText")}`}</Text>
                    <View style={{ position: 'absolute', right: 20 }}>
                        <TouchableOpacity onPress={() => addHandler('d')}>
                            <Icon name='pluscircle' size={19} color={Constants.appColors.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View> */}
        <View style={{ marginLeft: 12, marginTop: 36 }}>
          <Text>{`${t('ExamplesText')}`}</Text>
        </View>
        {examplesInputs.map((input, key) => (
          <View
            style={[styles.inputContainer, { height: 48, borderRadius: 6 }]}
            key={key}>
            <TextInput
              placeholder={` ${t('EnterSampleExamplesText')} ${key + 1}`}
              value={input.value}
              onChangeText={(text) => inputHandler('e', text, key)}
              style={{ fontSize: 17 }}
              placeholderTextColor={Constants.appColors.LIGHTGRAY}
            />
            <View style={{ position: 'absolute', right: 4 }}>
              <TouchableOpacity onPress={() => deleteHandler('e', key)}>
                <Icon
                  name="minuscircle"
                  size={19}
                  color={Constants.appColors.RED}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            alignItems: 'center',
            marginLeft: 12,
          }}>
          <Text>{`${t('AddAnAdditionalExample')}`}</Text>
          <View style={{ position: 'absolute', right: 20 }}>
            <TouchableOpacity onPress={() => addHandler('e')}>
              <Icon
                name="pluscircle"
                size={19}
                color={Constants.appColors.GREEN}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginLeft: 12, marginTop: 8 }}>
          <Text>{`${t('CategoryText')}`}</Text>
        </View>
        <TouchableOpacity onPress={() => setOverlayActive(true)}>
          <View
            style={{
              height: 48,
              borderRadius: 6,
              marginTop: 8,
              marginBottom: 48,
              marginHorizontal: 12,
              backgroundColor: Constants.appColors.WHITE,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={{
                paddingLeft: 4,
                fontSize: 17,
                color: Constants.appColors.BLACK,
                width: Sizes.WINDOW_WIDTH - 70,
              }}>{` ${category}`}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
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
    borderBottomColor: 'lightgray',
    marginHorizontal: 16,
    backgroundColor: Constants.appColors.WHITE,
    marginVertical: 4,
  },
});
