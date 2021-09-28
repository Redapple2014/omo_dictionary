import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Platform,
  Image,
  StatusBar,
  Keyboard,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomSearchBar from '../../components/searchbar/CustomSearchBar';
import AsyncStorage from '@react-native-community/async-storage';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import PouchDB from 'pouchdb-react-native';
import Tts from 'react-native-tts';
import {useTranslation} from 'react-i18next';
import {NAVIGATION_SEARCH_RESULT_SCREEN_PATH} from '../../navigations/Routes';
import SQLite from 'react-native-sqlite-2';
import {openDatabase} from 'react-native-sqlite-storage';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
import {defaultSettings} from '../../utills/userdata';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
PouchDB.plugin(require('pouchdb-find')).plugin(SQLiteAdapter);

// old word database
const localDB = new PouchDB('dev', {adapter: 'react-native-sqlite'});

// open database
const db = openDatabase(
  {name: 'omo_test.db', createFromLocation: 1},
  openCB,
  errorCB,
);

// open database failed
function errorCB(err) {
  console.log('SQL Error: ' + err);
}

// open database successfully
function openCB() {
  console.log('Database OPENED');
}

const HomeScreen = (props) => {
  const MAX_NUMBER_OF_RECENT_DATA = 3;
  const MAX_NUMBER_OF_RECENT_VIEWED_DATA = 10;
  const [searchText, setSearchText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [reacientlySearchedData, setReacientlySearchedData] = useState([]);
  const [reacientlyViewedDataSet, setReacientlyViewedDataSet] = useState([]);
  const [reacientlySearchedStatus, setReacientlySearchedStatus] = useState('');
  const [searchedData, setSearchdata] = useState([]);
  const {t, i18n} = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const inputEl = useRef(null);
  const [ids, setIDS] = useState([]);
  const [newData, setNewData] = useState([]);

  //delete recently searched data
  const removeItemValue = async function (key) {
    try {
      await AsyncStorage.removeItem(key);
      if (key === 'recent_data') {
        setReacientlyViewedDataSet([]);
        console.log('cleared v');
      } else {
        setReacientlySearchedData([]);
        console.log('cleared s');
      }

      return true;
    } catch (exception) {
      return false;
    }
  };

  // retrieve recently searched data
  function getDatafromStorage(from) {
    AsyncStorage.getItem(from)
      .then((req) => {
        if (!req) {
          setReacientlySearchedStatus(`${t('NoRecentDataAvalibleText')}`);
          //console.log('no data found on recent search')
          return;
        }
        if (from === 'search_data') {
          setReacientlySearchedData(JSON.parse(req));
        } else {
          setReacientlyViewedDataSet(JSON.parse(req));
        }
      })
      .catch((error) => console.log('error!'));
  }

  // search the entered data
  function onSearchSubmit() {
    if (searchText) {
      if (reacientlySearchedData.length > MAX_NUMBER_OF_RECENT_DATA) {
        reacientlySearchedData.splice(MAX_NUMBER_OF_RECENT_DATA, 1);
      }
      AsyncStorage.setItem(
        'search_data',
        JSON.stringify([searchText, ...reacientlySearchedData]),
      );
      getDatafromStorage('search_data');
      setSearchText(searchText);
      searchFunc(searchText);
    } else {
      console.log('search text input is empty');
      setSearchText('');
    }
  }

  //store reciently viewed data
  function storeRecentlyViewedData(newData) {
    if (newData) {
      if (reacientlyViewedDataSet.length > MAX_NUMBER_OF_RECENT_VIEWED_DATA) {
        reacientlyViewedDataSet.splice(MAX_NUMBER_OF_RECENT_VIEWED_DATA, 1);
      }
      AsyncStorage.setItem(
        'recent_data',
        JSON.stringify([newData, ...reacientlyViewedDataSet]),
      );
      getDatafromStorage('recent_data');
    } else {
      console.log('search text input is empty');
      setSearchText('');
    }
  }

  //function to check if the inputed text is korean
  const isKoreanWord = (text) => {
    const re = /[\u3131-\uD79D]/giu;
    const match = text.match(re);
    return match ? match.length === text.length : false;
  };

  function getWordData(wordId) {
    const query =
      `SELECT w.id, w.lemma, w.partofspeech, origin,
          (SELECT JSON_OBJECT(
            'lemma', (SELECT JSON_GROUP_ARRAY(words_app.lemma)  from words_app where  words_app.id = w.id ),
          'writtenForm', (SELECT JSON_GROUP_ARRAY(words_app.writtenForm)  from words_app where  words_app.id = w.id )
          )) as wordForm
          ,
          (SELECT JSON_OBJECT(
            'en_lm', (SELECT JSON_GROUP_ARRAY(words_en.en_lm)  from words_en where  words_en.id = w.id ),
            'en_def', (SELECT JSON_GROUP_ARRAY(words_en.en_def)  from words_en where  words_en.id = w.id )
          )) as sense
      FROM (
        SELECT lemma, id,  partofspeech, origin   FROM words_info WHERE    searchLemma  LIKE "${text}%" COLLATE NOCASE 
      UNION 
        SELECT lemma, id, NULL as partofspeech, NULL as origin FROM words_app  where lemma LIKE "${text}%" COLLATE NOCASE  ORDER BY lemma ) as w 
      WHERE partofspeech IS NOT NULL AND origin IS NOT NULL limit 50;`



    db.transaction((tx) => {
      // console.log(sql)
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        console.log('Query completed : ', len);
        var temp = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          temp.push(row);
        }
        setNewData(temp);
      });
    });
  }

  function searchFunc(text) {
    setSearchdata([]);
    if (text.length == 0) {
      return;
    }
    const query =
      `SELECT * FROM ( ` +
      `SELECT lemma, id,  partofspeech   FROM words_info WHERE   searchLemma  LIKE "${text}%" COLLATE NOCASE ` +
      `UNION ` +
      `SELECT lemma, id, NULL as  partofspeech FROM words_app  WHERE lemma LIKE "${text}%" COLLATE NOCASE  ORDER BY lemma )` +
      `WHERE partofspeech IS NOT NULL;`;

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        console.log('Query completed : ', len);
        var temp = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          temp.push(row);
        }
        setSearchdata(temp);
      });
    });
  }

  //console.log(`total data: ${JSON.stringify(searchedData)}`);

  useEffect(() => {
    getDatafromStorage('search_data');
    getDatafromStorage('recent_data');
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  //render method of equivalent under sence of each item  
  function renderEquivalent(dataSet) {
    let arr = dataSet;
    if (arr != 'undefined') {
      return arr.map((data, i) => {
        if (data.l == '몽골어') {
          return (
            <View key={`${i + data?.le}`} style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 17, marginTop: 2}}>{`${i + 1} `}</Text>
              <Text
                style={{
                  color: Constants.appColors.BLACK,
                  fontSize: 18,
                }}>{`${data?.le}`}</Text>
            </View>
          );
        }
      });
    } else {
      return <></>;
    }
  }

  // render recently searched data
  function renderRecentSearchData() {
    return (
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        renderItem={({item, index}) => (
          <TouchableOpacity key={index} onPress={() => setSearchText(item)}>
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                height: 45,
                borderBottomWidth: 0.5,
                borderColor: Constants.appColors.LIGHTGRAY,
                alignItems: 'center',
                paddingHorizontal: 8,
                borderWidth: 0.5,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: Constants.appColors.GRAY,
                  paddingLeft: 12,
                }}>
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        data={reacientlySearchedData}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  //render recently viewed data list
  function renderRecentViewData() {
    return (
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              props.navigation.navigate(NAVIGATION_SEARCH_RESULT_SCREEN_PATH, {
                searchResultData: item,
              });
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderBottomWidth: 0.5,
                borderColor: Constants.appColors.LIGHTGRAY,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderWidth: 0.5,
              }}>
              {item?.L?.w && (
                <View
                  style={{position: 'absolute', zIndex: 3, right: 16, top: 8}}>
                  <TouchableOpacity
                    onPress={() => {
                      try {
                        Tts.setDefaultLanguage('ko-KR');
                        Tts.speak(item?.L?.w);
                      } catch (e) {
                        //console.log(`cannot play the sound file`, e)
                        Toast.show('No Audio File Found', Toast.SHORT);
                      }
                    }}>
                    <AntDesign
                      name="sound"
                      size={19}
                      color={Constants.appColors.BLACK}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.TextStyle}>
                <Text style={{fontWeight: 'bold'}}>{item?.L?.w}</Text>
                {item?.o && `(${item?.o})`}
              </Text>
              <Text
                style={[
                  styles.TextStyle,
                  {color: Constants.appColors.GRAY, fontSize: 12},
                ]}>
                {item?.p}
              </Text>

              <View
                key={index}
                style={{
                  marginHorizontal: 4,
                  flexDirection: 'row',
                  paddingLeft: 12,
                }}>
                {item?.S[0]?.E && renderEquivalent(item?.S[0]?.E)}
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        data={reacientlyViewedDataSet}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  // render recently searched data list
  function renderSearchData() {
    return (
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              const id = item._id;
              localDB
                .get(id)
                .then(function (doc) {
                  storeRecentlyViewedData(doc);
                  console.log(`data : ${id} `, JSON.stringify(doc));
                  props.navigation.navigate(
                    NAVIGATION_SEARCH_RESULT_SCREEN_PATH,
                    {
                      searchResultData: doc,
                    },
                  );
                })
                .catch(function (err) {
                  console.log(err);
                });
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderBottomWidth: 0.5,
                borderColor: Constants.appColors.LIGHTGRAY,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderWidth: 0.5,
                height: 50,
                justifyContent: 'center',
              }}>
              <View
                style={{position: 'absolute', zIndex: 3, right: 16, top: 8}}>
                <TouchableOpacity
                  onPress={() => {
                    try {
                      Tts.setDefaultLanguage('ko-KR');
                      Tts.speak(item?.name);
                    } catch (e) {
                      //console.log(`cannot play the sound file`, e)
                      Toast.show('No Audio File Found', Toast.SHORT);
                    }
                  }}>
                  <AntDesign
                    name="sound"
                    size={19}
                    color={Constants.appColors.BLACK}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.TextStyle}>
                {item.lemma}
                {/* {item?.origin && `(${item?.origin})`} */}
              </Text>
              {/* <Text
                style={[
                  styles.TextStyle,
                  {color: Constants.appColors.GRAY, fontSize: 12},
                ]}>
                {item?.partOfSpeech}
              </Text> */}

              {/* <View
                key={index}
                style={{
                  marginHorizontal: 4,
                  flexDirection: 'row',
                  paddingLeft: 12,
                }}>
                <Text style={{fontSize: 17, marginTop: 2}}>{`${
                  index + 1
                } `}</Text>
                {item?.Sense[0]?.Equivalent &&
                  renderEquivalent(item?.Sense[0]?.Equivalent)}
              </View> */}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        data={searchedData}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: Constants.appColors.PRIMARY_COLOR,
          paddingTop: Platform.OS == 'ios' ? getStatusBarHeight() : 0,
        }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.appColors.PRIMARY_COLOR}
        />
      </View>
      {isLoading ? (
        <View style={[styles.spinnerStyle]}>
          <ActivityIndicator
            size="large"
            color={Constants.appColors.PRIMARY_COLOR}
          />
          <Text>{loadingText}</Text>
        </View>
      ) : (
        <>
          <View
            style={{
              backgroundColor: 'red',
              justifyContent: 'center',
              height:
                isKeyboardVisible || searchText.length > 0
                  ? Sizes.WINDOW_HEIGHT * 0.1
                  : Sizes.WINDOW_HEIGHT * 0.38,
              backgroundColor: Constants.appColors.PRIMARY_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isKeyboardVisible || searchText.length > 0 ? (
              <></>
            ) : (
              <View style={{marginBottom: Sizes.WINDOW_WIDTH * 0.18}}>
                <Image
                  source={require('../../assets/logo/home-logo.png')}
                  style={{width: 300, height: 100, resizeMode: 'contain'}}
                />
              </View>
            )}
          </View>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <CustomSearchBar
              ref={inputEl}
              lightTheme
              value={searchText}
              onChangeText={(value) => {
                setSearchText(value);
                //searchResult(value);
                searchFunc(value);
              }}
              inputContainerStyle={{
                backgroundColor: Constants.appColors.WHITE,
                height: 48,
                borderRadius: 10,
                top: -1,
              }}
              containerStyle={{
                padding: 0,
                margin: 0,
                borderRadius: 18,
                height: 45,
                width: '95%',
                marginTop: Sizes.statusBarHeight,
                top: isKeyboardVisible
                  ? Sizes.WINDOW_HEIGHT * 0.01
                  : searchText.length > 0
                  ? Sizes.WINDOW_HEIGHT * 0.01
                  : Sizes.WINDOW_HEIGHT * 0.29,
                position: 'absolute',
                alignSelf: 'center',
              }}
              inputStyle={{color: 'black'}}
              placeholder={`${t('SearchBarPlaceholderText')}`}
              onSubmitEditing={onSearchSubmit}
            />
          </TouchableWithoutFeedback>

          {isKeyboardVisible &&
          searchText.length == 0 &&
          reacientlySearchedData.length != 0 ? (
            <>
              <View
                style={{
                  marginVertical: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 8,
                }}>
                <Text style={{fontWeight: 'bold'}}>{`${t(
                  'RecentlySearchedText',
                )}`}</Text>
                <TouchableOpacity
                  onPress={() => removeItemValue('search_data')}>
                  <Text
                    style={{
                      fontWeight: '400',
                      textDecorationLine: 'underline',
                    }}>
                    {`${t('ClearHistoryText')}`}
                  </Text>
                </TouchableOpacity>
              </View>
              {renderRecentSearchData()}
            </>
          ) : reacientlySearchedData.length == 0 && isKeyboardVisible ? (
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{paddingTop: 16}}>{reacientlySearchedStatus}</Text>
            </View>
          ) : (
            <></>
          )}
          {!isKeyboardVisible &&
          searchText.length == 0 &&
          reacientlyViewedDataSet.length != 0 ? (
            <>
              <View
                style={{
                  marginVertical: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 8,
                }}>
                <Text style={{fontWeight: 'bold'}}>{`${t(
                  'RecentlyViewedText',
                )}`}</Text>
                <TouchableOpacity
                  onPress={() => removeItemValue('recent_data')}>
                  <Text
                    style={{
                      fontWeight: '400',
                      textDecorationLine: 'underline',
                    }}>
                    {`${t('ClearHistoryText')}`}
                  </Text>
                </TouchableOpacity>
              </View>
              {renderRecentViewData()}
            </>
          ) : (
            <></>
          )}
          {searchText.length > 0 && searchedData.length != 0 ? (
            <>{renderSearchData()}</>
          ) : searchedData.length == 0 && searchText.length > 0 ? (
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{paddingTop: 100}}>{`${t('NodataFoundText')}`}</Text>
            </View>
          ) : (
            <></>
          )}
        </>
      )}
    </View>
  );
};

HomeScreen.navigationOptions = {
  headerShown: false,
};

export default HomeScreen;

const styles = StyleSheet.create({
  spinnerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: Sizes.WINDOW_HEIGHT / 2 - 40,
    left: Sizes.WINDOW_WIDTH / 2 - 40,
    zIndex: 2,
  },
  TextStyle: {
    fontSize: 16,
    color: Constants.appColors.BLACK,
    paddingLeft: 12,
  },
});
