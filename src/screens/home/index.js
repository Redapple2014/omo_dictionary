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
  BackHandler,
} from 'react-native';
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
import {defaultSettings} from '../../utills/userdata';
import db from '../../utills/loadDb';
import {partofspeech} from '../../utills/userdata';
import * as Animatable from 'react-native-animatable';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
PouchDB.plugin(require('pouchdb-find')).plugin(SQLiteAdapter);

let backHandlerClickCount = 0;
var userDB = new PouchDB('usersettings');

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

  // let position = isKeyboardVisible
  //   ? Sizes.WINDOW_HEIGHT * 0.016
  //   : searchText.length > 0
  //   ? Sizes.WINDOW_HEIGHT * 0.01
  //   : Sizes.WINDOW_HEIGHT * 0.29;
  // const [topPositon, setTopPositon] = useState(position);

  // const [ids, setIDS] = useState([]);
  // const [newData, setNewData] = useState([]);

  async function loadFile(index) {
    if (index == 1) {
      userDB
        .post(defaultSettings)
        .then(function (response) {
          AsyncStorage.setItem('inserted_data', 'inserted');
          setLoading(false);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  const getActiveRouteState = (route) => {
    if (
      !route.routes ||
      route.routes.length === 0 ||
      route.index >= route.routes.length
    ) {
      return route;
    }
    const childActiveRoute = route.routes[route.index];
    return getActiveRouteState(childActiveRoute);
  };

  function handleBackButtonClick() {
    console.log('data : ', props.navigation.state.routeName);
    // let name = getActiveRouteState(props.navigation.state)
    if (props.navigation.state.routeName == 'HomeScreen') {
      backHandlerClickCount += 1;
      if (backHandlerClickCount < 2) {
        isKeyboardVisible ? Keyboard.dismiss() : setSearchText('');
        Toast.show('Press back twice to close app');
      } else {
        BackHandler.exitApp();
      }
      setTimeout(() => {
        backHandlerClickCount = 0;
      }, 500);

      return true;
    }
    return false;
  }

  function getSearchBarPostion() {
    const text = inputEl.current.props.value;
    return isKeyboardVisible
      ? Sizes.WINDOW_HEIGHT * 0.016
      : text.length > 0
      ? Sizes.WINDOW_HEIGHT * 0.01
      : Sizes.WINDOW_HEIGHT * 0.29;
  }

  function moveUp() {
    let pos = getSearchBarPostion();
    const translate = {
      from: {
        translateY: pos,
      },
      to: {
        translateY: 10,
      },
    };
    searchView.current?.animate(translate, 200);
  }

  function moveDown() {
    let pos = getSearchBarPostion();

    const translate = {
      from: {
        translateY: 10,
      },
      to: {
        translateY: pos,
      },
    };
    searchView.current?.animate(translate, 200);
  }

  useEffect(() => {
    //BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    createIndexes();
    let pos = getSearchBarPostion();

    const translate = {
      from: {
        translateY: 10,
      },
      to: {
        translateY: pos,
      },
    };
    searchView.current?.animate(translate, 5);
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
    onSearchSubmit();
    setSearchText('');
  };

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
      getWordData(searchText);
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

  const onCancel = () => {
    setSearchText('');
    Keyboard.dismiss();
  };

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
    const engQuery = `SELECT words_info.id, words_info.lemma, words_info.partofspeech, words_info.origin,
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

    const koreanQuery = `SELECT w.id, w.lemma, w.partofspeech, w.origin,
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

      LEFT JOIN words_app ON words_app.id = w.id
      LEFT JOIN words_en ON words_en.id = w.id
      GROUP BY w.id  
      ORDER by w.lemma`;

    let query = '';
    if (isKoreanWord(text)) {
      console.log('korean word====');
      query = koreanQuery;
    } else {
      console.log('english word====');
      query = engQuery;
    }

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
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
        moveUp();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        moveDown();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //render method of equivalent under sence of each item
  function renderEquivalent(dataSet) {
    let arr = JSON.parse(dataSet);
    // console.log(arr)
    if (arr != 'undefined') {
      return arr.map((data, i) => {
        // if (data.l == '몽골어') {
        return (
          <View key={`${i}`} style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 15,
                marginTop: 2,
                color: Constants.appColors.BLACK,
              }}>{`${i + 1} `}</Text>
            <Text
              style={{
                color: Constants.appColors.BLACK,
                fontSize: 15,
                marginTop: 2,
              }}>{`${data.en_lm}`}</Text>
          </View>
        );
        // }
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
                flexDirection: 'row',
                height: 45,
                alignItems: 'center',
                backgroundColor: 'white',
                paddingVertical: 8,
                paddingHorizontal: 8,
                marginVertical: 6,
                marginHorizontal: 8,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: Constants.appColors.BLACK,
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
                paddingVertical: 8,
                paddingHorizontal: 8,
                marginVertical: 6,
                marginHorizontal: 8,
                borderRadius: 10,
              }}>
              {(item?.partofspeech ?? item?.partOfSpeech) && (
                <View
                  style={{position: 'absolute', zIndex: 3, right: 16, top: 8}}>
                  <TouchableOpacity
                    onPress={() => {
                      try {
                        Tts.setDefaultLanguage('ko-KR');
                        Tts.speak(item?.lemma);
                      } catch (e) {
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
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 3,
                    right: 20,
                    top: 36,
                    flexDirection: 'row',
                  }}>
                  {[...Array(item?.vocabularyLevel)].map((e, i) => (
                    <Image
                      key={i}
                      style={{width: 10, height: 10}}
                      source={require('../../assets/logo/star.png')}
                    />
                  ))}
                </View>
              )}
              <Text style={styles.TextStyle}>
                <Text style={{fontWeight: 'bold'}}>{item?.lemma}</Text>
                <Text>{item?.origin && `(${item?.origin})`}</Text>
              </Text>
              {(item?.partofspeech ?? item?.partOfSpeech) && (
                <Text
                  style={[
                    styles.TextStyle,
                    {color: Constants.appColors.GRAY, fontSize: 12},
                  ]}>
                  {(item?.partofspeech && partofspeech[item?.partofspeech]) ??
                    (item?.partOfSpeech && partofspeech[item?.partOfSpeech])}
                </Text>
              )}
              <View
                key={index}
                style={{
                  marginHorizontal: 4,
                  paddingLeft: 12,
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
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              // console.log(item)
              storeRecentlyViewedData(item);
              props.navigation.navigate(NAVIGATION_SEARCH_RESULT_SCREEN_PATH, {
                searchResultData: item,
                ids,
              });
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingVertical: 8,
                paddingHorizontal: 8,
                marginVertical: 6,
                marginHorizontal: 8,
                borderRadius: 10,
                height: 'auto',
                justifyContent: 'center',
              }}>
              {(item?.partofspeech ?? item?.partOfSpeech) && (
                <View
                  style={{position: 'absolute', zIndex: 3, right: 16, top: 8}}>
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
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 3,
                    right: 16,
                    top: 36,
                    flexDirection: 'row',
                  }}>
                  {[...Array(item?.vocabularyLevel)].map((e, i) => (
                    <Image
                      key={i}
                      style={{width: 10, height: 10}}
                      source={require('../../assets/logo/star.png')}
                    />
                  ))}
                </View>
              )}
              <Text style={styles.TextStyle}>
                {item?.lemma}
                {item?.origin && `(${item?.origin})`}
              </Text>
              {item?.partofspeech || item?.partOfSpeech ? (
                <Text
                  style={[
                    styles.TextStyle,
                    {color: Constants.appColors.GRAY, fontSize: 12},
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

                  paddingLeft: 12,
                }}>
                {item?.sense && renderEquivalent(item?.sense)}
              </View>
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
  console.log(searchText.length > 0 && isKeyboardVisible);

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
          <Animatable.View
            ref={searchView}
            style={{
              zIndex: 1,
              backgroundColor: Constants.appColors.TRANSPARENT,
              marginTop: Sizes.statusBarHeight,
              position: 'absolute',
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              width: '95%',
            }}>
            <CustomSearchBar
              ref={inputEl}
              lightTheme
              value={searchText}
              onChangeText={(value) => {
                setSearchText(value);
                getWordData(value);
              }}
              inputContainerStyle={{
                backgroundColor: Constants.appColors.TRANSPARENT,
                height: 43,
                borderRadius: 14,
                marginTop: -10,
              }}
              containerStyle={{
                borderRadius: 20,
                height: 30,
                flex: isKeyboardVisible ? 0.99 : 1,
                padding: 0,
                marginTop: 0,
                backgroundColor: Constants.appColors.PRIMARY_COLOR,
              }}
              showCancel={true}
              onCancel={() => alert('ff')}
              inputStyle={{color: 'black', marginLeft: -2, marginTop: 4}}
              placeholder={
                searchText.length === 0 && isKeyboardVisible === false
                  ? `${t('SearchBarPlaceholderText')}`
                  : ''
              }
              onSubmitEditing={onSearchSubmit}
              onClear={onClear}
            />
            {/* </View> */}

            {/* </TouchableWithoutFeedback> */}
            {isKeyboardVisible && (
              <TouchableOpacity onPress={onCancel}>
                <View style={{alignItems: 'center', paddingHorizontal: 12}}>
                  <Text
                    style={{
                      color: Constants.appColors.WHITE,
                      fontWeight: '600',
                      fontSize: 15,
                    }}>{`${t('CancelText')}`}</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animatable.View>
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
