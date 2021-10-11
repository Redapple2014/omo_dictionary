import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  NativeModules,
  NativeEventEmitter,
  StyleSheet,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import SearchHeader from '../../components/searchHeader';
import {NavigationActions} from 'react-navigation';
import {useTranslation} from 'react-i18next';
import Tts from 'react-native-tts';
import db from '../../utills/loadDb';
import Toast from 'react-native-simple-toast';
import {partofspeech, vocabularyLevel} from '../../utills/userdata';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import PouchDB from 'pouchdb-react-native';
import {NavigationEvents} from 'react-navigation';
var hangulRomanization = require('hangul-romanization');
var userDB = new PouchDB('usersettings');

const SearchResultScreen = (props) => {
  const data = props.navigation.getParam('searchResultData', 'nothing sent');
  const ids = props.navigation.getParam('ids', []);
  const {t, i18n} = useTranslation();
  const [initData, setInitdata] = useState(data.id);
  const [userSettings, setUserSettings] = useState({});
  const ee = new NativeEventEmitter(NativeModules.TextToSpeech);
  ee.addListener('tts-start', () => {});
  ee.addListener('tts-finish', () => {});
  ee.addListener('tts-cancel', () => {});

  const [wordInfo, setWordInfo] = useState([]);

  const getWordInfo = () => {
    const query = `SELECT words_info.id, words_info.lemma AS lemma, words_info.partofspeech AS partofspeech, words_info.origin AS origin, words_info.vocabularyLevel as vocabularyLevel, words_info.lexicalUnit as lexicalUnit,
                    words_info.homonym_number AS homonym_number, words_info.annotation AS annotation,

              (select
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', words_en.sense_id, 'en_lm', words_en.en_lm, 'en_def', words_en.en_def)))
              FROM words_en where words_en.id = ${initData}
              )
              AS sense,

              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('type', rel_form.type, 'writtenForm', rel_form.writtenForm)))
              FROM rel_form where rel_form.rel_form_id = ${initData}
              )
              AS relatedForm,
            
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', words_ex.sense_id, 'type', words_ex.type, 'example_1', words_ex.example_1,  'example_2', words_ex.example_2 ))) 
              FROM words_ex where words_ex.id = ${initData}
              )
              AS senseExample,
            
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('lemma', words_app.lemma, 'writtenForm', words_app.writtenForm)))
              FROM words_app where words_app.id = ${initData}
              )
              AS wordForm,

              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('lemma', idioms_info.lemma, 'lexicalUnit', idioms_info.lexicalUnit)))
              FROM idioms_info where idioms_info.id = ${initData}
              )
              AS idiomInfo,
                
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', idioms_en.sense_id,'lemma', idioms_en.lemma,  'en_lm', idioms_en.en_lm, 'en_def', idioms_en.en_def)))
              FROM idioms_en where idioms_en.id = ${initData}
              )
              AS idiomsSense,
                
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', idioms_ex.sense_id,  'example_1', idioms_ex.example_1, 'lemma', idioms_ex.lemma,  'example_2', idioms_ex.example_2, 'example_id', idioms_ex.example_id, 'type', idioms_ex.type )))
              FROM idioms_ex where idioms_ex.id = ${initData}
              )
              AS idiomsSenseSample,
                
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', idioms_def.sense_id,'lemma', idioms_def.lemma,  'syntacticPattern', idioms_def.syntacticPattern)))
              FROM idioms_def where idioms_def.id = ${initData}
              )
              AS idiomsDef,

              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', trans_en.sense_id,'lemma', trans_en.lemma, 'example_id', trans_en.example_id,  'example_1', trans_en.trans_en_1, 'example_2', trans_en.trans_en_2 )))
              FROM trans_en where trans_en.id = ${initData}
              )
              AS translate
          
            FROM words_info 
            WHERE  words_info.id = ${initData} `;

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        let row = results.rows.item(0);
        setWordInfo(row);
      });
    });
  };

  useEffect(() => {
    getWordInfo();
  }, [initData]);


console.log(wordInfo)

  //load user setting
  async function fetchUserSettings() {
    userDB.allDocs(
      {
        include_docs: true,
        attachments: true,
      },
      function (err, response) {
        if (err) {
          setUserSettings({});
          return console.log(err);
        }

        // console.log("user settings data ", JSON.stringify(response.rows[0].doc.Dictionary))
        setUserSettings(response.rows[0].doc.Dictionary);
        return response.rows[0];
      },
    );
  }

  //detect if the user put is korean
  const isKoreanWord = (text) => {
    const re = /[\u3131-\uD79D]/g;
    const match = text.match(re);
    return match ? match.length === text.length : false;
  };

  const renderIdiomsSenseSample = (idiomsSenseSample, id) => {
    try {
      let arr = JSON.parse(idiomsSenseSample);
      return arr.map((data, i) => {
        if (data.sense_id === id) {
          return (
            <View key={`${i + data?.example_1}`}>
              {data?.example_1 && <Text>{`${data.example_1}`}</Text>}
              {userSettings.displayTranslatorExample && (
                <Text style={styles.exampleStyle}>
                  {hangulRomanization.convert(data?.example_1)}
                </Text>
              )}
              {data?.example_2 && <Text>{`${data.example_2}`}</Text>}
              {userSettings.displayTranslatorExample && (
                <Text style={styles.exampleStyle}>
                  {hangulRomanization.convert(data?.example_2)}
                </Text>
              )}
            </View>
          );
        } else {
          return <></>;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const renderIdiomDefData = (idiomsSense, id) => {
    try {
      let arr = JSON.parse(idiomsSense);
      return arr.map((data, i) => {
        if (data.sense_id === id) {
          return (
            <View key={`${i + data?.en_lm}`}>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    width: Sizes.WINDOW_WIDTH - 64,
                    color: Constants.appColors.PRIMARY_COLOR,
                  }}>{`${data?.en_lm}`}</Text>
                <Text
                  style={{
                    width: Sizes.WINDOW_WIDTH - 64,
                  }}>{`${data?.en_def}`}</Text>
              </View>
              <View
                style={{
                  marginLeft: 0,
                  height: 'auto',
                  paddingVertical: 4,
                  borderBottomWidth: 0.4,
                  marginBottom: 4,
                  paddingBottom: 8,
                  borderBottomColor: Constants.appColors.LIGHTGRAY,
                }}>
                {renderIdiomsSenseSample(
                  wordInfo.idiomsSenseSample,
                  data.sense_id,
                )}
              </View>
            </View>
          );
        } else {
          return <></>;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  //render idioms from sense
  const renderIdiomsData = (idioms) => {
    try {
      let arr = JSON.parse(idioms);
      return arr.map((data, i) => {
        return (
          <>
            <View
              style={{flexDirection: 'row', marginVertical: 4, marginLeft: 6}}
              key={`${i + data?.lemma}`}>
              <Text style={{fontSize: 17}}>{i + 1} </Text>
              <View>
                <Text
                  style={{
                    color: Constants.appColors.BLACK,
                    fontSize: 17,
                    marginBottom: 8,
                  }}>{`${data?.lemma}; `}</Text>
                {renderIdiomDefData(wordInfo.idiomsSense, data.sense_id)}
              </View>
            </View>
            {data?.syntacticPattern && (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    backgroundColor: '#3D9CE0',
                    height: 24,
                    width: '30%',
                    alignItems: 'center',
                    borderRadius: 10,
                    marginRight: 8,
                  }}>
                  <Text
                    style={{
                      marginTop: 3,
                      textAlign: 'center',
                      color: 'white',
                      marginHorizontal: 8,
                    }}>{`${t('SentenceText')}`}</Text>
                </View>
                <Text style={{marginTop: 3}}>{data?.syntacticPattern}</Text>
              </View>
            )}
          </>
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  //render Sense leema from sense
  const renderSeneData = (sense) => {
    try {
      let arr = JSON.parse(sense);
      return arr.map((data, i) => {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 4,
                marginLeft: 6,
                alignItems: 'center',
              }}
              key={`${i + data?.en_lm}`}>
              <Text style={{fontSize: 17, textAlign: 'center'}}>
                {data.sense_id}{' '}
              </Text>
              {/* <View> */}
              <Text
                style={{
                  color: Constants.appColors.PRIMARY_COLOR,
                  fontSize: 17,
                  textAlign: 'center',
                }}>{`${data?.en_lm}; `}</Text>
              {/* </View> */}
            </View>
            {renderSeneDefData(wordInfo.sense, data.sense_id)}
          </>
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  //render Sense definations from sense
  const renderSeneDefData = (sense, sense_id) => {
    try {
      let arr = JSON.parse(sense);
      return arr.map((data, i) => {
        if (data.sense_id === sense_id) {
          return (
            <View key={`${i + data?.en_def}`}>
              <View
                style={{
                  flexDirection: 'column',
                  marginVertical: 4,
                  marginLeft: 22,
                }}>
                <Text
                  style={{
                    width: Sizes.WINDOW_WIDTH - 64,
                  }}>{`${data?.en_def}`}</Text>
              </View>
              <View
                style={{
                  marginTop: 2,
                  paddingBottom: 8,
                  borderBottomWidth: 0.4,
                  borderBottomColor: Constants.appColors.LIGHTGRAY,
                }}>
                <CollapsibleView
                  initExpanded={data?.sense_id == 1 ? true : false}
                  touchableWrapperStyle={{alignItems: 'flex-start'}}
                  noArrow
                  title=" ">
                  {renderSenseExampleData(
                    wordInfo.senseExample,
                    data?.sense_id,
                  )}
                </CollapsibleView>
              </View>
            </View>
          );
        } else {
          return <></>;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  //render Sense Example from sense
  const renderSenseExampleData = (senseExample, sense_id) => {
    try {
      let arr = JSON.parse(senseExample);
      return arr.map((data, i) => {
        if (data.sense_id === sense_id) {
          return (
            // <View style={{ height: 40 }} key={`${i + data?.example_1}`}>
            <View
              key={`${i + data?.example_1}`}
              style={{
                marginVertical: 2,
                paddingLeft: 6,
                borderLeftWidth: 2,
                borderLeftColor: Constants.appColors.PRIMARY_COLOR,
                marginLeft: 8,
              }}>
              {data?.example_1 && (
                <Text
                  style={{
                    color: Constants.appColors.PRIMARY_COLOR,
                  }}>{`${data.example_1}`}</Text>
              )}
              {userSettings.displayTranslatorExample && data?.example_1 && (
                <Text style={styles.exampleStyle}>
                  {hangulRomanization.convert(data?.example_1)}
                </Text>
              )}
              {data?.example_2 && (
                <Text
                  style={{
                    color: Constants.appColors.PRIMARY_COLOR,
                  }}>{`${data.example_2}`}</Text>
              )}
              {userSettings.displayTranslatorExample && data?.example_2 && (
                <Text style={styles.exampleStyle}>
                  {hangulRomanization.convert(data?.example_2)}
                </Text>
              )}
            </View>
          );
        } else {
          return <></>;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  //render each item
  const renderData = (type, dataSet) => {
    let arr = JSON.parse(dataSet);
    // console.log(arr)
    if (arr != 'undefined') {
      return arr.map((data, i) => {
        if (type == 1) {
          //console.log('Applications : ', arr);
          if (data?.lemma != 'undefined' || data?.lemma != 'null') {
            return (
              data?.writtenForm && (
                <View
                  key={i + data?.p}
                  style={{marginHorizontal: 2, marginTop: 3}}>
                  <Text>{`${data && data?.writtenForm},`}</Text>
                </View>
              )
            );
          } else {
            return <Text></Text>;
          }
        } else if (type == 2) {
          // console.log('Derivatives : ', arr);
          if (data?.type != 'undefined' || data?.type != 'null') {
            return (
              data?.writtenForm && (
                <View key={i} style={{marginHorizontal: 2}}>
                  <Text>{`${data && data?.writtenForm},`}</Text>
                </View>
              )
            );
          } else {
            return <Text></Text>;
          }
        } else {
          return <></>;
        }
      });
    } else {
      return;
    }
  };

  return (
    <View style={{flex: 1}}>
      <NavigationEvents onDidFocus={(payload) => fetchUserSettings()} />
      <View
        style={{
          backgroundColor: Constants.appColors.PRIMARY_COLOR,
          paddingTop: Platform.OS == 'ios' ? getStatusBarHeight() : 0,
        }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.appColors.PRIMARY_COLOR}
        />
        <SearchHeader
          title=""
          leftIcon={`${t('SearchText')}`}
          show={true}
          onPressleftIcon={() =>
            props.navigation.dispatch(NavigationActions.back())
          }
          upArrowStyle={
            ((ids.indexOf(initData) && ids) || ids.length == 0) == 0
              ? false
              : true
          }
          downArrowStyle={
            (ids.indexOf(initData) || ids.length == 0) == ids.length - 1
              ? false
              : true
          }
          onSoundPlay={() => {
            try {
              Tts.setDefaultLanguage('ko-KR');
              Tts.speak(data?.lemma);
            } catch (e) {
              //console.log(`cannot play the sound file`, e)
              Toast.show(`${t('NoAudioFileFoundText')}`, Toast.SHORT);
            }
          }}
          upArrowFunction={() => {
            if (ids.length > 0) {
              var pos = ids.indexOf(initData);
              //console.log(initData)
              if (pos == 0) {
                return;
              } else {
                pos--;
                setInitdata(ids[pos]);
              }
            }
          }}
          downArrowFunction={() => {
            if (ids.length > 0) {
              var pos = ids.indexOf(initData);
              if (pos == ids.length - 1) {
                return;
              } else {
                pos++;
                setInitdata(ids[pos]);
              }
            }
          }}
        />
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: Constants.appColors.WHITE,
          paddingHorizontal: 8,
        }}>
        <View style={{paddingHorizontal: 16, backgroundColor: 'white'}}>
          <View
            style={{
              paddingVertical: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 24, color: 'black', fontWeight: 'bold'}}>
                {wordInfo?.lemma}
              </Text>
              <Text style={{fontSize: 24, color: 'black', fontWeight: '500'}}>
                {wordInfo?.origin && `(${wordInfo?.origin})`}
              </Text>
            </View>
            {userSettings.displayRomaja && wordInfo?.lemma && (
              <Text
                style={{marginVertical: 4, color: Constants.appColors.GRAY}}>
                {hangulRomanization.convert(wordInfo?.lemma)}
              </Text>
            )}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {(wordInfo?.partofspeech ?? wordInfo?.partOfSpeech) && (
                <Text
                  style={{paddingRight: 6, color: Constants.appColors.GRAY}}>
                  {(wordInfo?.partofspeech &&
                    partofspeech[wordInfo?.partofspeech]) ??
                    (wordInfo?.partOfSpeech &&
                      partofspeech[wordInfo?.partOfSpeech])}
                </Text>
              )}

              {vocabularyLevel[wordInfo?.vocabularyLevel] != 0 && (
                <View style={{flexDirection: 'row'}}>
                  {[...Array(vocabularyLevel[wordInfo.vocabularyLevel])].map(
                    (e, i) => (
                      <Image
                        key={i}
                        style={{width: 14, height: 14}}
                        source={require('../../assets/logo/star.png')}
                      />
                    ),
                  )}
                </View>
              )}
            </View>
          </View>

          {/* {wordInfo?.wordForm?.writtenForm && wordInfo?.wordForm?.relatedForm && (
            <View style={{ marginVertical: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: '#3D9CE0',
                    height: 22,
                    width: '30%',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      marginTop: 3,
                      textAlign: 'center',
                      color: 'white',
                      marginHorizontal: 8,
                    }}>{`${t('ApplicationsText')}`}</Text>
                </View>
                {wordInfo?.wordForm && renderData(1, wordInfo?.wordForm)}
              </View>
              <View style={{ marginTop: 8, flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: '#5ED65C',
                    height: 22,
                    width: '30%',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      marginRight: 8,
                      textAlign: 'center',
                      color: 'white',
                      marginHorizontal: 8,
                    }}>{`${t('DerivativesText')}`}</Text>
                </View>
                {data?.r && renderData(2, data?.w)}
              </View>
            </View>
          )} */}
        </View>
        {wordInfo?.sense && wordInfo?.senseExample && (
          <>
            <View
              style={{
                backgroundColor: '#f8f8f8',
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}>
              <Text
                style={{fontSize: 16, color: Constants.appColors.GRAY}}>{`${t(
                'DefinitionText',
              )}`}</Text>
            </View>
            <View style={{backgroundColor: 'white', flex: 1}}>
              <View>{renderSeneData(wordInfo?.sense)}</View>
              {wordInfo?.idiomsDef.length > 2 && (
                <View>
                  <View
                    style={{
                      backgroundColor: '#f8f8f8',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}>
                    <Text style={{fontSize: 16}}>{`${t('IdiomsText')}`}</Text>
                  </View>
                  <View style={{paddingRight: 12}}>
                    {wordInfo?.idiomsDef &&
                      renderIdiomsData(wordInfo?.idiomsDef)}
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

SearchResultScreen.navigationOptions = {
  headerShown: false,
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  exampleStyle: {
    color: Constants.appColors.GRAY,
    fontStyle: 'italic',
    fontSize: 13,
  },
});
