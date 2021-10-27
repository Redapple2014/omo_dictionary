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
  ActivityIndicator,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomSearchBar from '../../components/searchbar/CustomSearchBar';
import AsyncStorage from '@react-native-community/async-storage';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Toast from 'react-native-simple-toast';
import PouchDB from 'pouchdb-react-native';
import Tts from 'react-native-tts';
import {useTranslation} from 'react-i18next';
import {NAVIGATION_SEARCH_RESULT_SCREEN_PATH} from '../../navigations/Routes';
import SQLite from 'react-native-sqlite-2';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
import {NavigationState} from 'react-navigation';
import {
  defaultSettings,
  defaultFlashcardTestSettings,
} from '../../utills/userdata';
import {partofspeech, vocabularyLevel} from '../../utills/userdata';
import * as Animatable from 'react-native-animatable';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
PouchDB.plugin(require('pouchdb-find')).plugin(SQLiteAdapter);

var userDB = new PouchDB('usersettings');
var testSettings = new PouchDB('testsettings');

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
  const searchView = useRef(null);
  const [ids, setIds] = useState([]);
  const [lastPositin, setLastPositin] = useState(Sizes.WINDOW_HEIGHT * 0.02);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  // console.log(expand)
  async function loadFile(index) {
    if (index == 1) {
      userDB
        .post(defaultSettings)
        .then(function (response) {
          loadFile(2);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    if (index == 2) {
      testSettings
        .post(defaultFlashcardTestSettings)
        .then(function (response) {
          AsyncStorage.setItem('inserted_data', 'inserted');
          setLoading(false);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  function handleBackButtonClick() {
    let isFocused = props.navigation.isFocused();
    if (props.navigation.state.routeName == 'HomeScreen') {
      let text = inputEl.current.props.value;
      if (isFocused == true && text.length > 0) {
        setSearchFocused(false);
        setIsSearch(false);
        const translate = {
          from: {
            translateY: Sizes.WINDOW_HEIGHT * 0.02,
          },
          to: {
            translateY: Sizes.WINDOW_HEIGHT * 0.29,
          },
        };
        searchView.current?.animate(translate, 80);
        setSearchText('');

        Keyboard.dismiss();
        return true;
      }

      return false;
    }
    return false;
  }

  function getSearchBarPostion() {
    // return isKeyboardVisible
    //   ?
    //   :
    //   ?
    //   : ;

    if (isKeyboardVisible) {
      return Sizes.WINDOW_HEIGHT * 0.02;
    } else if (searchText.length > 0) {
      Sizes.WINDOW_HEIGHT * 0.02;
    } else if (searchFocused) {
      return Sizes.WINDOW_HEIGHT * 0.02;
    } else {
      return Sizes.WINDOW_HEIGHT * 0.29;
    }
  }

  function getTopBarPostion() {
    if (isKeyboardVisible || searchText.length != 0 || isSearch === true) {
      return Platform.OS == 'ios'
        ? Sizes.WINDOW_HEIGHT * 0.08
        : Sizes.WINDOW_HEIGHT * 0.1;
    } else {
      return Platform.OS == 'ios'
        ? Sizes.WINDOW_HEIGHT * 0.36
        : Sizes.WINDOW_HEIGHT * 0.38;
    }
  }

  useEffect(() => {
    getWordData(searchText);
  }, [searchText]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    createIndexes();
    createCategoryTable();
    createCardTable();
    const translate = {
      from: {
        translateY: Sizes.WINDOW_HEIGHT * 0.02,
      },
      to: {
        translateY: Sizes.WINDOW_HEIGHT * 0.29,
      },
    };
    searchView.current?.animate(translate, 50);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  //lopping of all json
  async function loadAllJsons() {
    AsyncStorage.getItem('inserted_data')
      .then((flag) => {
        if (!flag) {
          setLoadingText('Insert data ...');
          loadFile(1);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => console.log('error!'));
  }

  //delete recently searched data
  const removeItemValue = async function (key) {
    try {
      await AsyncStorage.removeItem(key);
      if (key === 'recent_data') {
        setReacientlyViewedDataSet([]);
        console.log('cleared v');
      } else {
        setReacientlySearchedData([]);
        setReacientlySearchedStatus(`${t('NoRecentDataAvalibleText')}`);
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
          if (from === 'search_data') {
            setReacientlySearchedStatus(`${t('NoRecentDataAvalibleText')}`);
          } else {
          }

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

  const onClear = () => {
    console.log('here');
    // onSearchSubmit();
    // setExpand(false)
    setSearchText('');
  };

  const onCancel = () => {
    setIsSearch(false);
    const translate = {
      from: {
        translateY: Sizes.WINDOW_HEIGHT * 0.02,
      },
      to: {
        translateY: Sizes.WINDOW_HEIGHT * 0.29,
      },
    };
    searchView.current?.animate(translate, 80);
    setSearchText('');
    setSearchFocused(false);
    Keyboard.dismiss();
  };

  // search the entered data
  function onSearchSubmit() {
    if (searchText) {
      if (reacientlySearchedData.includes(searchText)) {
        return;
      } else {
        if (reacientlySearchedData.length > MAX_NUMBER_OF_RECENT_DATA) {
          reacientlySearchedData.splice(MAX_NUMBER_OF_RECENT_DATA, 1);
        }
        AsyncStorage.setItem(
          'search_data',
          JSON.stringify([searchText, ...reacientlySearchedData]),
        );
        getDatafromStorage('search_data');
        setSearchText(searchText);
        getWordData(searchText);
      }
    } else {
      console.log('search text input is empty');
      setSearchText('');
    }
  }

  //store reciently viewed data
  async function objectPropInArray(list, prop, val) {
    if (list.length > 0) {
      for (let i in list) {
        if (list[i][prop] === val) {
          return true;
        }
      }
    }
    return false;
  }

  async function storeRecentlyViewedData(newData) {
    const x = await objectPropInArray(
      reacientlyViewedDataSet,
      'id',
      newData.id,
    );
    if (newData) {
      if (x) {
        return;
      } else {
        if (reacientlyViewedDataSet.length > MAX_NUMBER_OF_RECENT_VIEWED_DATA) {
          reacientlyViewedDataSet.splice(MAX_NUMBER_OF_RECENT_VIEWED_DATA, 1);
        }
        AsyncStorage.setItem(
          'recent_data',
          JSON.stringify([newData, ...reacientlyViewedDataSet]),
        );
        getDatafromStorage('recent_data');
      }
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

  function createCardTable() {
    const query = `CREATE TABLE IF NOT EXISTS cards(id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INT,
        category_id INT,
        speech VARCHAR(100),
        hanja VARCHAR(100),
        englishHeadWord VARCHAR(100), 
        definition VARCHAR(100),
        examples TEXT,
        koreanHeadWord VARCHAR(100),
        card_order INT);`;

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        console.log('created');
      });
    });
  }

  function createCategoryTable() {
    const query = `CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100), 
        type VARCHAR(30),  
        cat_order INT);`;

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        console.log('created');
      });
    });
  }

  function createIndexes() {
    const query =
      'CREATE INDEX idx_words_info_searchLemma ON words_info (searchLemma);';

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {});
    });

    const query1 = 'CREATE INDEX idx_words_app_lemma ON words_app (lemma);';
    db.transaction((tx) => {
      tx.executeSql(query1, [], (tx, results) => {});
    });
  }

  function getWordData(text) {
    console.log('data searching');
    setSearchdata([]);
    const engQuery = `SELECT words_info.id, words_info.lemma, words_info.partofspeech, words_info.vocabularyLevel as vocabularyLevel, words_info.origin,
          JSON_GROUP_ARRAY(DISTINCT(json_object('en_lm', words_en.en_lm, 'en_def', words_en.en_def)))
          AS sense,

          JSON_GROUP_ARRAY(DISTINCT(json_object('lemma', words_app.lemma, 'writtenForm', words_app.writtenForm))) 
          AS wordForm
      FROM (
      SELECT *
        FROM en_search
        WHERE en_lm MATCH "${text}" 
        COLLATE NOCASE
        GROUP BY id
      ) as w 

      INNER JOIN words_info ON words_info.id = w.id
      LEFT JOIN words_app ON words_app.id = w.id
      LEFT JOIN words_en ON words_en.id = w.id
      GROUP BY words_info.id  
      ORDER by words_info.lemma;`;

    const koreanQuery = `SELECT words_info.id, words_info.lemma, words_info.partofspeech, words_info.vocabularyLevel as vocabularyLevel, words_info.origin,
          JSON_GROUP_ARRAY(DISTINCT(json_object('en_lm', words_en.en_lm, 'en_def', words_en.en_def)))
          AS sense,

          JSON_GROUP_ARRAY(DISTINCT(json_object('lemma', words_app.lemma, 'writtenForm', words_app.writtenForm))) 
          AS wordForm
      FROM (
        SELECT * FROM (
          SELECT DISTINCT lemma,  id,  partofspeech, origin   FROM words_info WHERE    searchLemma  LIKE "${text}%" COLLATE NOCASE 
          UNION 
          SELECT lemma, id, NULL as partofspeech, NULL as origin FROM words_app  where writtenForm LIKE "${text}%" COLLATE NOCASE ORDER by id
        ) GROUP BY id
      ) as w 
      INNER JOIN words_info ON words_info.id = w.id
      LEFT JOIN words_app ON words_app.id = w.id
      LEFT JOIN words_en ON words_en.id = w.id
      GROUP BY w.id  
      ORDER by w.lemma;`;

    let query = '';
    if (isKoreanWord(text)) {
      // console.log('korean word====');
      query = koreanQuery;
    } else {
      // console.log('english word====');
      query = engQuery;
    }

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        console.log(len);
        console.log('Query completed : ', len);
        var temp = [];
        var ids = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          temp.push(row);
          ids.push(row.id);
        }
        setIds(ids);
        setSearchdata(temp);
      });
    });
  }

  useEffect(() => {
    loadAllJsons();
    getDatafromStorage('search_data');
    getDatafromStorage('recent_data');

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        // setTimeout(() => {
        //   moveUp();
        // }, 0);
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

  const redenerToast = (xy) => {
    switch (xy) {
      case 0:
        return;
      case 1:
        Toast.show('            ⭐\nElementary Level', Toast.SHORT);
        break;
      case 2:
        Toast.show('         ⭐⭐\nElementary Level', Toast.SHORT);
        break;
      case 3:
        Toast.show('       ⭐⭐⭐\nElementary Level', Toast.SHORT);
        break;
      default:
        break;
    }
  };

  //render method of equivalent under sence of each item
  function renderEquivalent(dataSet) {
    let arr = JSON.parse(dataSet);
    if (arr != 'undefined') {
      return arr.map((data, i) => {
        return (
          <View key={`${i} `} style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 15,
                marginTop: 2,
                left: 4,
                color: Constants.appColors.BLACK,
              }}>{`${i + 1} `}</Text>
            <Text
              style={{
                color: Constants.appColors.BLACK,
                fontSize: 15,
                marginTop: 2,
                left: 4,
                paddingLeft: 4,
              }}>{`${data.en_lm}`}</Text>
          </View>
        );
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
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSearchText(item);
              Keyboard.dismiss();
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 45,
                alignItems: 'center',
                backgroundColor: 'white',
                paddingVertical: 8,
                paddingHorizontal: 8,
                marginVertical: 4,
                marginHorizontal: 8,
                borderRadius: 10,
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 16,
                  color: Constants.appColors.BLACK,
                  paddingLeft: 12,
                  width: Sizes.WINDOW_WIDTH - 48,
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
                paddingVertical: 8,
                paddingHorizontal: 8,
                marginTop: 6,
                marginHorizontal: 8,
                borderRadius: 10,
                height: 'auto',
                justifyContent: 'center',
                marginBottom: index + 1 == searchedData.length ? 6 : 0,
                // borderWidth:1
              }}>
              <View
                style={{
                  zIndex: 4,
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  justifyContent: 'flex-start',
                  width: 40,
                  // borderWidth:1
                }}>
                {(item?.partofspeech ?? item?.partOfSpeech) && (
                  <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => {
                        try {
                          Tts.setDefaultLanguage('ko-KR');
                          Tts.speak(item?.lemma);
                        } catch (e) {
                          //console.log(`cannot play the sound file`, e)
                          Toast.show('No Audio File Found', Toast.SHORT);
                        }
                      }}>
                      <Image
                        source={require('../../assets/logo/audio-black-icon.png')}
                        style={{width: 18, height: 18, resizeMode: 'contain'}}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {item?.vocabularyLevel && (
                  <TouchableOpacity
                    onPress={() =>
                      redenerToast(vocabularyLevel[item.vocabularyLevel])
                    }>
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        marginTop: 8,
                        zIndex: 4,
                      }}>
                      {vocabularyLevel[item?.vocabularyLevel] != 0 &&
                        vocabularyLevel[item?.vocabularyLevel] != 'undefined' &&
                        [...Array(vocabularyLevel[item.vocabularyLevel])].map(
                          (e, i) => (
                            <Image
                              key={i}
                              style={{width: 12, height: 12}}
                              source={require('../../assets/logo/star.png')}
                            />
                          ),
                        )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.TextStyle,
                    {fontWeight: 'bold', paddingLeft: 0, marginRight: 4},
                  ]}>
                  {item?.lemma}
                </Text>
                <Text style={[styles.TextStyle, {paddingLeft: 0}]}>
                  {item?.origin && `(${item?.origin})`}
                </Text>
              </View>
              {(item?.partofspeech ?? item?.partOfSpeech) && (
                <Text
                  style={[
                    styles.TextStyle,
                    {
                      color: Constants.appColors.GRAY,
                      fontSize: 12,
                      fontStyle: 'italic',
                      marginVertical: 1,
                      paddingLeft: 0,
                      // borderWidth:1
                    },
                  ]}>
                  {(item?.partofspeech && partofspeech[item?.partofspeech]) ??
                    (item?.partOfSpeech && partofspeech[item?.partOfSpeech])}
                </Text>
              )}
              <View
                key={index}
                style={{
                  marginHorizontal: 4,
                  left: -4,
                  // borderWidth:1
                }}>
                {item?.sense && renderEquivalent(item?.sense)}
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
        // keyboardShouldPersistTaps={'never'}
        onScrollEndDrag={() => Keyboard.dismiss()}
        keyboardDismissMode={'on-drag'}
        renderItem={({item, index}) => {
          // console.log(item);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                console.log(item);
                storeRecentlyViewedData(item);
                props.navigation.navigate(
                  NAVIGATION_SEARCH_RESULT_SCREEN_PATH,
                  {
                    searchResultData: item,
                    ids,
                  },
                );
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  marginTop: 6,
                  marginHorizontal: 8,
                  borderRadius: 10,
                  height: 'auto',
                  justifyContent: 'center',
                  marginBottom: index + 1 == searchedData.length ? 6 : 0,
                  // borderWidth:1
                }}>
                <View
                  style={{
                    zIndex: 4,
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    justifyContent: 'flex-start',
                    width: 40,
                    // borderWidth:1
                  }}>
                  {(item?.partofspeech ?? item?.partOfSpeech) && (
                    <View style={{alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        onPress={() => {
                          try {
                            Tts.setDefaultLanguage('ko-KR');
                            Tts.speak(item?.lemma);
                          } catch (e) {
                            //console.log(`cannot play the sound file`, e)
                            Toast.show('No Audio File Found', Toast.SHORT);
                          }
                        }}>
                        <Image
                          source={require('../../assets/logo/audio-black-icon.png')}
                          style={{width: 18, height: 18, resizeMode: 'contain'}}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {item?.vocabularyLevel && (
                    <TouchableOpacity
                      onPress={() =>
                        redenerToast(vocabularyLevel[item.vocabularyLevel])
                      }>
                      <View
                        style={{flexDirection: 'row-reverse', marginTop: 6}}>
                        {vocabularyLevel[item?.vocabularyLevel] != 0 &&
                          vocabularyLevel[item?.vocabularyLevel] !=
                            'undefined' &&
                          [...Array(vocabularyLevel[item.vocabularyLevel])].map(
                            (e, i) => (
                              <Image
                                key={i}
                                style={{width: 12, height: 12}}
                                source={require('../../assets/logo/star.png')}
                              />
                            ),
                          )}
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={[
                      styles.TextStyle,
                      {fontWeight: 'bold', paddingLeft: 0, marginRight: 4},
                    ]}>
                    {item?.lemma}
                  </Text>
                  <Text style={[styles.TextStyle, {paddingLeft: 0}]}>
                    {item?.origin && `(${item?.origin})`}
                  </Text>
                </View>
                {item?.partofspeech || item?.partOfSpeech ? (
                  <Text
                    style={[
                      styles.TextStyle,
                      {
                        color: Constants.appColors.GRAY,
                        fontSize: 12,
                        fontStyle: 'italic',
                        marginVertical: 1,
                        left: 0,
                        paddingLeft: 0,
                        // borderWidth:1
                      },
                    ]}>
                    {(item?.partofspeech && partofspeech[item?.partofspeech]) ??
                      (item?.partOfSpeech && partofspeech[item?.partOfSpeech])}
                  </Text>
                ) : (
                  <></>
                )}
                <View
                  key={index}
                  style={{
                    marginHorizontal: 4,
                    left: -4,
                    // borderWidth:1
                  }}>
                  {item?.sense && renderEquivalent(item?.sense)}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
        }}></View>
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
              height: getTopBarPostion(),
              backgroundColor: Constants.appColors.PRIMARY_COLOR,
              alignItems: 'center',
            }}>
            {isKeyboardVisible || searchText.length > 0 || searchFocused ? (
              <></>
            ) : (
              <View style={{marginBottom: Sizes.WINDOW_WIDTH * 0.15}}>
                {isSearch === false && (
                  <Image
                    source={require('../../assets/logo/home-logo.png')}
                    style={{width: 300, height: 100, resizeMode: 'contain'}}
                  />
                )}
              </View>
            )}
          </View>
          <Animatable.View
            ref={searchView}
            style={{
              zIndex: 1,
              backgroundColor: Constants.appColors.TRANSPARENT,
              marginTop: Sizes.statusBarHeight,
              position: 'absolute',
              flexDirection: 'column',
              alignItems: 'flex-start',
              alignSelf: 'center',
              width: '92%',
            }}>
            <View style={{width: Sizes.WINDOW_WIDTH}}>
              <CustomSearchBar
                ref={inputEl}
                lightTheme
                value={searchText}
                onChangeText={(value) => {
                  setSearchText(value);
                  getWordData(value);
                  // setExpand(true)
                  setSearchFocused(true);
                }}
                inputContainerStyle={{
                  backgroundColor: Constants.appColors.TRANSPARENT,
                  height: 45,
                  borderRadius: 15,
                  marginTop: -2,
                  width:
                    isSearch === true
                      ? Sizes.WINDOW_WIDTH - 87
                      : Sizes.WINDOW_WIDTH - 30,
                  marginRight: 0,
                }}
                containerStyle={{
                  borderRadius: 20,
                  height: 36,
                  width:
                    isSearch === true
                      ? Sizes.WINDOW_WIDTH - 87
                      : Sizes.WINDOW_WIDTH - 30,
                  flex: 1,
                  padding: 0,
                  marginTop: 0,
                }}
                leftIconContainerStyle={{right: -6}}
                showCancel={false}
                inputStyle={{color: 'black', fontSize: 16}}
                placeholder={
                  isSearch === false ? `${t('SearchBarPlaceholderText')}` : ''
                }
                onSubmitEditing={onSearchSubmit}
                onClear={onClear}
                clearIcon={isSearch}
                onFocus={() => {
                  if (isSearch === false) {
                    const translate = {
                      from: {
                        translateY: Sizes.WINDOW_HEIGHT * 0.29,
                      },
                      to: {
                        translateY: Sizes.WINDOW_HEIGHT * 0.02,
                      },
                    };
                    searchView.current?.animate(translate, 80);
                    setIsSearch(true);
                  }
                }}
              />
              {isSearch === true && (
                <View
                  style={{
                    alignItems: 'center',
                    left: Sizes.WINDOW_WIDTH - 77,
                    top: -24,
                    width: 50,
                  }}>
                  <TouchableOpacity onPress={onCancel}>
                    <Text
                      style={{
                        color: Constants.appColors.WHITE,
                        fontWeight: '600',
                        fontSize: 15,
                      }}>{`${t('CancelText')}`}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* <Text> cancel</Text>

            {(isKeyboardVisible || searchText.length != 0 || searchFocused) && ( */}
            {/* <TouchableOpacity onPress={onCancel}>
              <View
                style={{
                  alignItems: 'center',
                  //paddingHorizontal: 8,
                  left: Sizes.WINDOW_WIDTH - 77,
                  top: -24,
                  //backgroundColor: 'blue',
                }}>
                <Text
                  style={{
                    color: Constants.appColors.GREEN,
                    fontWeight: '600',
                    fontSize: 15,
                  }}>{`${t('CancelText')}`}</Text>
              </View>
            </TouchableOpacity> */}
            {/* )} */}
          </Animatable.View>
          {searchText.length == 0 &&
          isSearch === true &&
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
                      fontStyle: 'italic',
                    }}>
                    {`${t('ClearHistoryText')}`}
                  </Text>
                </TouchableOpacity>
              </View>
              {renderRecentSearchData()}
            </>
          ) : reacientlySearchedData.length == 0 &&
            isKeyboardVisible &&
            searchText.length == 0 ? (
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Sizes.WINDOW_HEIGHT * 0.2,
              }}>
              <Image
                source={require('../../assets/logo/recent-icon.png')}
                style={{width: 60, height: 60}}
              />
              <Text style={{paddingTop: 4}}>{reacientlySearchedStatus}</Text>
            </View>
          ) : (
            <></>
          )}
          {isSearch === false && reacientlyViewedDataSet.length != 0 ? (
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
                      fontStyle: 'italic',
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
                marginTop: Sizes.WINDOW_HEIGHT * 0.2,
              }}>
              <Image
                source={require('../../assets/logo/search-icon.png')}
                style={{width: 50, height: 50}}
              />
              <Text style={{paddingTop: 4}}>{`${t('NodataFoundText')}`}</Text>
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
