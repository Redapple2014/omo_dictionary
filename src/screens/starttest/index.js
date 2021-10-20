import React, { useState, useRef, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import CustomHeader from "../../components/header";
import Constants from '../../utills/Constants';
import { NavigationActions, NavigationEvents } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import CustomInput from "../../components/input/CustomInput";
import FeatherIcons from "react-native-vector-icons/Feather";
import { partofspeech, vocabularyLevel } from '../../utills/userdata';
import Toast from 'react-native-simple-toast';
import PouchDB from 'pouchdb-react-native';
import CustomPopup from '../../components/popup/CustomPopup';
import Sizes from '../../utills/Size';
import { forntDisplay } from '../../utills/userdata';
import { CheckBox } from 'react-native-elements';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import CustomButton from "../../components/button/CustomButton";
import EIcons from 'react-native-vector-icons/Entypo';
import {
  NAVIGATION_TEST_RESULT_SCREEN_PATH
} from '../../navigations/Routes';

var hangulRomanization = require('hangul-romanization');
PouchDB.plugin(require('pouchdb-find'));

const status = 'reveal2'

const data = { "annotation": null, "homonym_number": 0, "id": 17866, "idiomInfo": "[]", "idiomsDef": "[]", "idiomsSense": "[]", "idiomsSenseSample": "[]", "lemma": "여보세요", "lexicalUnit": "단어", "origin": null, "partofspeech": "감탄사", "relatedForm": "[]", "sense": "[{\"sense_id\":2,\"en_lm\":\"hello; hi; hey there\",\"en_def\":\"An exclamation used to call another person who is nearby.\"},{\"sense_id\":1,\"en_lm\":\"hello\",\"en_def\":\"An exclamation used to call the other person on the phone.\"}]", "senseExample": "[{\"sense_id\":2,\"type\":\"문장\",\"example_1\":\"여보세요, 아무도 안 계세요?\",\"example_2\":null},{\"sense_id\":2,\"type\":\"문장\",\"example_1\":\"여보세요, 뭐 좀 여쭤 볼게요.\",\"example_2\":null},{\"sense_id\":2,\"type\":\"문장\",\"example_1\":\"여보세요, 여기 물 한 잔만 주세요.\",\"example_2\":null},{\"sense_id\":2,\"type\":\"대화\",\"example_1\":\"여보세요, 서울 가려면 여기서 버스 타면 되나요?\",\"example_2\":\"아니요, 건너편 가서 타셔야 돼요.\"},{\"sense_id\":1,\"type\":\"문장\",\"example_1\":\"여보세요, 제 말 들리세요?\",\"example_2\":null},{\"sense_id\":1,\"type\":\"문장\",\"example_1\":\"여보세요, 전화 바꿨습니다.\",\"example_2\":null},{\"sense_id\":1,\"type\":\"문장\",\"example_1\":\"여보세요, 거기 이 선생님 계세요?\",\"example_2\":null},{\"sense_id\":1,\"type\":\"대화\",\"example_1\":\"여보세요, 거기 김 사장님 댁입니까?\",\"example_2\":\"네, 맞는데 누구신가요?\"}]", "translate": "[{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":1,\"example_1\":\"Hello, is anyone here?\",\"example_2\":null},{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":2,\"example_1\":\"Hello, let me ask you something.\",\"example_2\":null},{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":3,\"example_1\":\"Hello, just a glass of water, please.\",\"example_2\":null},{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":4,\"example_1\":\"Hello, can I take a bus from here to Seoul?\",\"example_2\":\"No, you have to go across the street and get on.\"},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":1,\"example_1\":\"Hello, can you hear me?\",\"example_2\":null},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":2,\"example_1\":\"Hello, I changed my phone.\",\"example_2\":null},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":3,\"example_1\":\"Hello, is this teacher there?\",\"example_2\":null},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":4,\"example_1\":\"Hello, is that Mr. Kim's house?\",\"example_2\":\"Yes, that's right. Who are you?\"}]", "vocabularyLevel": "초급", "wordForm": "[]" }

//db instance with db_name
var localDB = new PouchDB('flashcard');

const StartTestScreen = (props) => {

  const { t, i18n } = useTranslation();

  //exit test handler
  const exitTest = () => {
    Alert.alert(
      `Exit Test`,
      `Would you like to exit this test session? Any progress will be saved.`,
      [
        {
          text: `${t("CancelText")}`,
          onPress: () => console.log("Cancel Pressed"),
          // style: "cancel"
        },
        { text: `Yes`, onPress: () => props.navigation.navigate(NAVIGATION_TEST_RESULT_SCREEN_PATH), style: "yes" }
      ])
  }

  //go back handeller
  const goBack = () => props.navigation.dispatch(NavigationActions.back())

  //render idioms examples
  const renderIdiomsSenseSample = (idiomsSenseSample, id) => {
    try {
      let arr = JSON.parse(idiomsSenseSample);
      return arr.map((data, i) => {
        if (data.sense_id === id) {
          return (
            <View key={`${i + data?.example_1}`}>
              {data?.example_1 && <Text>{`${data.example_1}`}</Text>}
              {true && (
                <Text style={styles.exampleStyle}>
                  {hangulRomanization.convert(data?.example_1)}
                </Text>
              )}
              {data?.example_2 && <Text>{`${data.example_2}`}</Text>}
              {true && (
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
              <View style={{ flexDirection: 'column' }}>
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
                  data.idiomsSenseSample,
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
              style={{ flexDirection: 'row', marginVertical: 4, marginLeft: 6 }}
              key={`${i + data?.lemma}`}>
              <Text style={{ fontSize: 17 }}>{i + 1} </Text>
              <View>
                <Text
                  style={{
                    color: Constants.appColors.BLACK,
                    fontSize: 17,
                    marginBottom: 8,
                  }}>{`${data?.lemma}; `}</Text>
                {renderIdiomDefData(data.idiomsSense, data.sense_id)}
              </View>
            </View>
            {data?.syntacticPattern && (
              <View style={{ flexDirection: 'row' }}>
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
                <Text style={{ marginTop: 3 }}>{data?.syntacticPattern}</Text>
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
      let arr = JSON.parse(sense)
      return arr.map((data1, i) => {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 4,
                marginLeft: 6,
                alignItems: 'center',
              }}
              key={`${i + data1?.en_lm}`}>
              <Text style={{ fontSize: 17, textAlign: 'center' }}>
                {i + 1}{' '}
              </Text>
              <Text
                style={{
                  color: Constants.appColors.PRIMARY_COLOR,
                  fontSize: 17,
                  textAlign: 'center',
                }}>{`${data1?.en_lm}; `}</Text>
            </View>
            {renderSeneDefData(data.sense, data1.sense_id)}
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
      return arr.map((data1, i) => {
        if (data1.sense_id === sense_id) {
          return (
            <View key={`${i + data1?.en_def}`}>
              <View
                style={{
                  flexDirection: 'column',
                  marginVertical: 4,
                  marginLeft: 22,
                }}>
                <Text
                  style={{
                    width: Sizes.WINDOW_WIDTH - 64,
                  }}>{`${data1?.en_def}`}</Text>
              </View>
              <View
                style={{
                  marginTop: 2,
                  paddingBottom: 8,
                  borderBottomWidth: 0.4,
                  borderBottomColor: Constants.appColors.LIGHTGRAY,
                }}>
                <CollapsibleView
                  initExpanded={data1?.sense_id == 1 ? true : false}
                  touchableWrapperStyle={{ alignItems: 'flex-start' }}
                  noArrow
                  title=" ">
                  {renderSenseExampleData(
                    data.senseExample,
                    data1?.sense_id,
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
      return arr.map((data1, i) => {
        if (data1.sense_id === sense_id) {
          return (
            // <View style={{ height: 40 }} key={`${i + data1?.example_1}`}>
            <View
              key={`${i + data1?.example_1}`}
              style={{
                marginVertical: 2,
                paddingLeft: 6,
                borderLeftWidth: 2,
                borderLeftColor: Constants.appColors.PRIMARY_COLOR,
                marginLeft: 8,
              }}>
              {data1?.example_1 && (
                <Text
                  style={{
                    color: Constants.appColors.PRIMARY_COLOR,
                  }}>{`${data1.example_1}`}</Text>
              )}
              {data1?.example_1 && (
                <Text style={styles.exampleStyle}>
                  {hangulRomanization.convert(data1?.example_1)}
                </Text>
              )}
              {data1?.example_2 && (
                <Text
                  style={{
                    color: Constants.appColors.PRIMARY_COLOR,
                  }}>{`${data1.example_2}`}</Text>
              )}
              {data1?.example_2 && (
                <Text style={styles.exampleStyle}>
                  {hangulRomanization.convert(data1?.example_2)}
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


  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
        <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 8, width: 85, left: 0, height: 30, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={() => { }}>
              <View style={{ flexDirection: 'row' }}>
                <EIcons name='arrow-bold-left' size={26} color={Constants.appColors.WHITE} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
              <View style={{ flexDirection: 'row' }}>
                <EIcons name='arrow-bold-right' size={26} color={Constants.appColors.WHITE} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.textStyle}>{`100/100`}</Text>

          <View style={{ width: 120, paddingRight: 4, right: -0, height: 30, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={() => { }}>
              <View style={{ flexDirection: 'row' }}>
                <FeatherIcons name='search' size={20} color={Constants.appColors.WHITE} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../../assets/logo/audio-white-icon.png')} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={exitTest}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: Constants.appColors.WHITE, fontSize: 16, fontWeight: '600' }}>{`${t("ExitText")}`}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView style={{
          backgroundColor: Constants.appColors.LIGHTGRAY,
          paddingHorizontal: 8,
          height: Sizes.WINDOW_HEIGHT * .415,
        }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
            <View
              style={{
                paddingVertical: 10,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>
                  {data.lemma}
                </Text>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: '500' }}>
                  {data?.origin && `(${data?.origin})`}
                </Text>
              </View>
              {data?.lemma && (
                <Text
                  style={{ marginVertical: 4, color: Constants.appColors.GRAY }}>
                  {hangulRomanization.convert(data?.lemma)}
                </Text>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {(data?.partofspeech ?? data?.partOfSpeech) && (
                  <Text
                    style={{ paddingRight: 6, color: Constants.appColors.GRAY }}>
                    {(data?.partofspeech &&
                      partofspeech[data?.partofspeech]) ??
                      (data?.partOfSpeech &&
                        partofspeech[data?.partOfSpeech])}
                  </Text>
                )}

                {vocabularyLevel[data?.vocabularyLevel] != 0 && (
                  <View style={{ flexDirection: 'row' }}>
                    {[...Array(vocabularyLevel[data.vocabularyLevel])].map(
                      (e, i) => (
                        <Image
                          key={i}
                          style={{ width: 14, height: 14 }}
                          source={require('../../assets/logo/star.png')}
                        />
                      ),
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* {data?.wordForm?.writtenForm && data?.wordForm?.relatedForm && (
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
                {data?.wordForm && renderData(1, data?.wordForm)}
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

          {data?.senseExample && (
            <>
              <View
                style={{
                  backgroundColor: '#f8f8f8',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}>
                <Text
                  style={{ fontSize: 16, color: Constants.appColors.GRAY }}>{`${t(
                    'DefinitionText',
                  )}`}</Text>
              </View>
              <View style={{ backgroundColor: 'white', flex: 1 }}>
                <View>{renderSeneData(data?.sense)}</View>
                {data?.idiomsDef.length > 2 && (
                  <View>
                    <View
                      style={{
                        backgroundColor: '#f8f8f8',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}>
                      <Text style={{ fontSize: 16 }}>{`${t('IdiomsText')}`}</Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      {data?.idiomsDef &&
                        renderIdiomsData(data?.idiomsDef)}
                    </View>
                  </View>
                )}
              </View>

            </>
          )}
        </ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1,backgroundColor:'white',borderTopWidth:.5,borderTopColor:Constants.appColors.LIGHTGRAY }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12, bottom: 0, position: 'absolute' }}>
            {status == 'reveal' && <View style={{ flexDirection: "row", justifyContent: 'space-between',marginBottom: Platform.OS == 'ios' ? 22 : 16  }}><CustomButton
              style={{ height: Sizes.WINDOW_HEIGHT * .21, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.LIGHTGRAY, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10}}
              title={`Reveal Card`}
              titleStyle={{ fontSize: 22, color: Constants.appColors.BLACK, fontWeight: 'bold' }}
              onPress={() => { }}
            /></View>
            }

            {status == 'reveal1' && (<View style={{ flexDirection: "row", justifyContent: 'space-between',marginBottom: Platform.OS == 'ios' ? 24 : 18  }}><CustomButton
              style={{ height: Sizes.WINDOW_HEIGHT * .2, width: Sizes.WINDOW_WIDTH / 2 - 16, marginRight: 8, backgroundColor: Constants.appColors.LIGHTGRAY, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
              title={`Correct`}
              titleStyle={{ fontSize: 22, color: Constants.appColors.BLACK, fontWeight: 'bold' }}
              onPress={() => { }}
            />
              <CustomButton
                style={{ height: Sizes.WINDOW_HEIGHT * .2, width: Sizes.WINDOW_WIDTH / 2 - 16, marginLeft: 8, backgroundColor: Constants.appColors.LIGHTGRAY, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                title={`Incorrect`}
                titleStyle={{ fontSize: 22, color: Constants.appColors.BLACK, fontWeight: 'bold' }}
                onPress={() => { }}
              /></View>
            )
            }

            {status == 'reveal2' && (
              <View style={{ justifyContent: 'space-between', marginBottom: Platform.OS == 'ios' ? 20 : 12 }}>
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                  <CustomButton
                    style={{ height: Sizes.WINDOW_HEIGHT * .1, width: Sizes.WINDOW_WIDTH / 2 - 16, marginRight: 6, marginVertical: 8, backgroundColor: Constants.appColors.LIGHTGRAY, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                    title={`1\nPerfect`}
                    titleStyle={{ fontSize: 18, color: Constants.appColors.BLACK, fontWeight: 'bold' }}
                    onPress={() => { }}
                  />
                  <CustomButton
                    style={{ height: Sizes.WINDOW_HEIGHT * .1, width: Sizes.WINDOW_WIDTH / 2 - 16, marginLeft: 6, marginVertical: 8, backgroundColor: Constants.appColors.LIGHTGRAY, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10, }}
                    title={`2\nRecalled`}
                    titleStyle={{ fontSize: 18, color: Constants.appColors.BLACK, fontWeight: 'bold' }}
                    onPress={() => { }}
                  />
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                  <CustomButton
                    style={{ height: Sizes.WINDOW_HEIGHT * .1, width: Sizes.WINDOW_WIDTH / 2 - 16, marginRight: 8, backgroundColor: Constants.appColors.LIGHTGRAY, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10, }}
                    title={`3\nBarely`}
                    titleStyle={{ fontSize: 18, color: Constants.appColors.BLACK, fontWeight: 'bold' }}
                    onPress={() => { }}
                  />
                  <CustomButton
                    style={{ height: Sizes.WINDOW_HEIGHT * .1, width: Sizes.WINDOW_WIDTH / 2 -16, marginLeft: 8, backgroundColor: Constants.appColors.LIGHTGRAY, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                    title={`4\nIncorrect`}
                    titleStyle={{ fontSize: 18, color: Constants.appColors.BLACK, fontWeight: 'bold' }}
                    onPress={() => { }}
                  />
                </View>
              </View>
            )
            }
          </View>
        </View>
      </View>
    </View>
  )
};

StartTestScreen.navigationOptions = {
  headerShown: false,
};

export default StartTestScreen;

const styles = StyleSheet.create({
  StatusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: Constants.appColors.BUTTON_COLOR
  },
  Settings: {
    marginHorizontal: 16,
    backgroundColor: Constants.appColors.WHITE,
    borderRadius: 15,
    padding: 12
  },
  MenuItems: {
    height: 40,
    borderBottomWidth: .5,
    borderBottomColor: Constants.appColors.LIGHTGRAY,
    justifyContent: 'center'
  },
  MenuItemIconStyle: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  MenuItemTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Constants.appColors.BLACK
  },
  userTypeViewStyle: {
    backgroundColor: Constants.appColors.SKY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8
  },
  userTypeTextStyle: {
    fontSize: 19,
    color: Constants.appColors.WHITE
  },
  userLabelText: {
    backgroundColor: Constants.appColors.SKY_COLOR,
    width: 60,
    paddingVertical: 2,
    borderRadius: 10,
  },
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: "lightgray",
    marginHorizontal: 16,
    backgroundColor: Constants.appColors.WHITE,
    marginVertical: 4
  },
  exampleStyle: {
    color: Constants.appColors.GRAY,
    fontStyle: 'italic',
    fontSize: 13,
  }
});