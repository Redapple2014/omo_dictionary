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
import indexFile from '../../resources/dictionary/summary_json.json';

import {useTranslation} from 'react-i18next';
import {NAVIGATION_SEARCH_RESULT_SCREEN_PATH} from '../../navigations/Routes';
import SQLite from 'react-native-sqlite-2';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
PouchDB.plugin(require('pouchdb-find')).plugin(SQLiteAdapter);
const localDB = new PouchDB('dev', {adapter: 'react-native-sqlite'});

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
  const [isLoading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const inputEl = useRef(null);


  async function loadFile(index) {
    if (index == 1) {
      import('../../resources/dictionary/1.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(2)
          })().catch(e => console.log("Caught: " + e));
          
        })
        .catch((error) => {
          console.log('error====', error);
        });
    }
    else if (index == 2) {
      import('../../resources/dictionary/2.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(3)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    }
    else if (index == 3) {
      import('../../resources/dictionary/4.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(4)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 4) {
      import('../../resources/dictionary/4.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(5)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 5) {
      import('../../resources/dictionary/5.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(6)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 6) {
      import('../../resources/dictionary/6.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(7)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 7) {
      import('../../resources/dictionary/7.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(8)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 8) {
      import('../../resources/dictionary/8.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(9)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 9) {
      import('../../resources/dictionary/9.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(10)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 10) {
      import('../../resources/dictionary/10.json')
        .then(({default: data}) => {
          (async () => {
            await insertJsonFile(index, data);
            loadFile(11)
          })().catch(e => console.log("Caught: " + e));
        })
        .catch((error) => {
          console.log('error====', error);
        });
    } 
    else if (index == 11) {
      import('../../resources/dictionary/11.json')
        .then(({default: data}) => {
          insertJsonFile(index, data);
          (async () => {
            await insertJsonFile(index, data);
            AsyncStorage.setItem('inserted_data', 'inserted')
            setLoading(false);
          })().catch(e => console.log("Caught: " + e));
          
        })
        .catch((error) => {
          console.log('error====', error);
        });
    }  
  }

  async function insertJsonFile(fileIndex, json) {
    let index = 0;
    while (json.length > 0){
      let data = json.splice(0,200)
      await insert(data);
      console.log(fileIndex, index);
      index++;
    }
   
  }

  //lopping of all json
  async function loadAllJsons() {

    AsyncStorage.getItem('inserted_data')
    .then((flag) => {
      if (!flag) {
        setLoadingText('Insert data ...');
        loadFile(1);
      }
      else{
        setLoading(false);
      }
    })
    .catch((error) => console.log('error!'));

  }

  async function indexDB() {
    console.log('create Index...');
    setLoadingText('Create Index ...');
    await localDB
      .createIndex({
        index: {
          fields: ['name'],
        },
      })
      .then(function (result) {
        // setLoading(false);
        console.log('created index successfully');
      })
      .catch(function (err) {
        // setLoading(false);
        console.log(err);
      });
  }

  //insert function
  async function insert(json) {
    //bulk data insert
    await localDB
      .bulkDocs(json)
      .then(function (result) {
        console.log('Row inserted Successfully');
      })
      .catch(function (err) {
        console.log('err=======', err);
        setLoading(false);
        console.log(
          'Unable to insert into DB. Error: ' + err.name + ' - ' + err.message,
        );
      });
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

  //retrive recently searched data
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

  //search the entered data
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
      searchResult(searchText);
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

  const isKoreanWord = (text) => {
    const re = /[\u3131-\uD79D]/giu;
    const match = text.match(re);
    return match ? match.length === text.length : false;
  };

  function searchResult(text) {
    // reset the search result
    setSearchdata([]);
    if (text.length == 0) {
      return;
    }

    var regex = new RegExp('^' + text + '+', 'i');
    var result = indexFile.filter(function (text) {
      return regex.test(text.name);
    });
    console.log('result', result);
    setSearchdata(result);

    // localDB
    //   .find({
    //     selector: {
    //       name: {$eq: `${text.toLowerCase()}`},
    //     },
    //     limit: 20,
    //     // fields: ['Lemma.writtenForm'],
    //   })
    //   .then(function (result) {
    //     // handle result
    //     console.log('done===', result.docs.length);
    //     setSearchdata(result.docs);
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
  }

  /* fro testing*/
  //fetch data by id
  async function fetchDataById() {
    // const id = '27733'
    // localDB.get(id).then(function (doc) {
    //  console.log(`data : ${id} `,JSON.stringify(doc))
    // }).catch(function (err) {
    //   console.log(err);
    // });

    // get all documents
    // localDB.allDocs().then(function (result) {
    //   console.log(JSON.stringify('************ ',result))
    //   }).catch(function (err) {
    //     console.log(err);
    //   });

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
        //console.log(response.rows);
      },
    );
  }

  useEffect(() => {
    loadAllJsons();

    // destroy db
    // try {
    //   localDB.destroy()
    //   setLoading(false)
    //   console.log('done')
    // } catch (e) {
    //   console.log(e)
    // }
  }, []);
  /* */

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

  function renderEquivalent(dataSet) {
    let arr = dataSet;
    if (arr != 'undefined') {
      return arr.map((data, i) => {
        if (data.language == '몽골어') {
          return (
            <View key={`${i + data?.lemma}`}>
              <Text
                style={{
                  color: Constants.appColors.BLACK,
                  fontSize: 18,
                }}>{`${data?.lemma}`}</Text>
            </View>
          );
        }
      });
    } else {
      return <></>;
    }
  }

  //render recently searched data
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
              <View
                style={{position: 'absolute', zIndex: 3, right: 16, top: 8}}>
                <TouchableOpacity
                  onPress={() => {
                    try {
                      Tts.setDefaultLanguage('ko-KR');
                      Tts.speak(item?.Lemma?.writtenForm);
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
                {item.name}
                {item?.origin && `(${item?.origin})`}
              </Text>
              <Text
                style={[
                  styles.TextStyle,
                  {color: Constants.appColors.GRAY, fontSize: 12},
                ]}>
                {item?.partOfSpeech}
              </Text>

              <View
                key={index}
                style={{
                  marginHorizontal: 4,
                  flexDirection: 'row',
                  paddingLeft: 12,
                }}>
                <Text style={{fontSize: 17, marginTop: 2}}>{`${
                  index + 1
                } `}</Text>
                {/* {item?.Sense[0]?.Equivalent &&
                  renderEquivalent(item?.Sense[0]?.Equivalent)} */}
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

  //render recently searched data list
  function renderSearchData() {
    return (
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              const id = item._id;
              localDB.get(id).then(function (doc) {
                storeRecentlyViewedData(item);
                console.log(`data : ${id} `,JSON.stringify(doc))
                props.navigation.navigate(NAVIGATION_SEARCH_RESULT_SCREEN_PATH, {
                  searchResultData: doc,
                });
              }).catch(function (err) {
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
              }}>
              <View
                style={{position: 'absolute', zIndex: 3, right: 16, top: 8}}>
                <TouchableOpacity
                  onPress={() => {
                    try {
                      Tts.setDefaultLanguage('ko-KR');
                      Tts.speak(item?.Lemma?.writtenForm);
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
                {item.name}
                {item?.origin && `(${item?.origin})`}
              </Text>
              <Text
                style={[
                  styles.TextStyle,
                  {color: Constants.appColors.GRAY, fontSize: 12},
                ]}>
                {item?.partOfSpeech}
              </Text>

              <View
                key={index}
                style={{
                  marginHorizontal: 4,
                  flexDirection: 'row',
                  paddingLeft: 12,
                }}>
                <Text style={{fontSize: 17, marginTop: 2}}>{`${
                  index + 1
                } `}</Text>
                {/* {item?.Sense[0]?.Equivalent &&
                  renderEquivalent(item?.Sense[0]?.Equivalent)} */}
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
                  source={require('../../assets/logo/omo-logo_1.png')}
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
                searchResult(value);
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
    top: Sizes.WINDOW_HEIGHT / 2 - 24,
    left: Sizes.WINDOW_WIDTH / 2 - 24,
    zIndex: 2,
  },
  TextStyle: {
    fontSize: 16,
    color: Constants.appColors.BLACK,
    paddingLeft: 12,
  },
});
