import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import SearchHeader from '../../components/searchHeader';
import { NavigationActions } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import Tts from 'react-native-tts';
import db from '../../utills/loadDb';
import Toast from 'react-native-simple-toast';
import ReadMore from '@fawazahmed/react-native-read-more';
// const data = {"homonym_number":"0","lexicalUnit":"단어","partOfSpeech":"동사","vocabularyLevel":"없음","Lemma":{"writtenForm":"갈아입히다"},"WordForm":[{"type":"발음","pronunciation":"가라이피다","sound":"https://dicmedia.korean.go.kr/multimedia/sound_file/giyeok_2005/garaipida.wav"},{"type":"활용","writtenForm":"갈아입히어","pronunciation":"가라이피여","sound":"https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/18000/14769_garaipiyeo.wav","FormRepresentation":{"type":"준말","writtenForm":"갈아입혀","pronunciation":"가라이펴","sound":"https://dicmedia.korean.go.kr/multimedia/naver/2016/50000/46000/14769_garaipyeo.wav"}},{"type":"활용","writtenForm":"갈아입히니","pronunciation":"가라이피니","sound":"https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/18000/14769_garaipini.wav"}],"RelatedForm":[{"type":"가봐라","_id":"53830","writtenForm":"갈아입다"}],"Sense":[{"_id":"1","definition":"입고 있던 옷을 벗고 다른 옷으로 바꾸어 입게 하다.","syntacticPattern":"1이 2에게 3을 (4로) 갈아입히다","SenseExample":[{"_id":"1","type":"구","example_1":"깨끗한 옷으로 갈아입히다."},{"_id":"2","type":"구","example_1":"새 옷으로 갈아입히다."},{"_id":"3","type":"구","example_1":"환자복으로 갈아입히다."},{"_id":"4","type":"문장","example_1":"잘 시간이 되어 엄마는 아이를 잠옷으로 갈아입혔다."},{"_id":"5","type":"문장","example_1":"간호사가 새로 입원하게 된 환자에게 환자복으로 갈아입힐 준비를 했다."},{"_id":"6","type":"대화","example_1":"아기가 바지에 오줌을 쌌어요.","example_2":"얼른 목욕시키고 옷을 갈아입혀야겠네."}],"Equivalent":[{"language":"몽골어","lemma":"сольж өмсүүлэх","definition":"өмсч байсан хувцасыг нь тайлж өөр хувцасаар сольж өмсгүүлэх."},{"language":"베트남어","lemma":"cho thay, bắt thay (quần áo)","definition":"Cởi quần áo đang mặc ra và cho đổi sang mặc quần áo khác."},{"language":"타이어","lemma":"เปลี่ยนชุดให้, เปลี่ยนเสื้อผ้าให้, เปลี่ยนใส่ชุดใหม่ให้","definition":"ทำให้ถอดเสื้อผ้าที่ใส่อยู่และเปลี่ยนใส่เสื้อผ้าชุดอื่น"},{"language":"인도네시아어","lemma":"menggantikan baju","definition":"melepaskan baju yang dipakai seseorang kemudian menggantikannya dengan yang lain"},{"language":"러시아어","lemma":"переодеть","definition":"Снять одежду и надеть другую. "},{"language":"영어","lemma":"change someone's clothes","definition":"To have someone take off his/her clothes and put on other clothes."},{"language":"일본어","lemma":"きがえさせる【着替えさせる】","definition":"着ている服を脱がせて、別の服に替えて着せる。"},{"language":"프랑스어","lemma":"changer, habiller, vêtir","definition":"Enlever un vêtement que porte quelqu'un, et lui en faire porter un autre."},{"language":"스페인어","lemma":"hacer cambiar","definition":"Obligar a mudarse de ropa."},{"language":"아랍어","lemma":"يُغيّر ملابسه","definition":"يَخلع ملابسه ويرتدي ملابس أخرى"},{"language":"중국어","lemma":"换，改换","definition":"让对方把身上的衣服脱掉，改穿别的衣服。"}]}],"_id":"14769","_rev":"1-ec5c603a4b9a449a8c99ea32ac86d3fb"}

// const data = {
//     "_id": "14769",
//     "h": "0",
//     "l": "단어",
//     "p": "동사",
//     "v": "없음",
//     "L": {
//         "w": "갈아입히다"
//     },
//     "w": [
//         {
//             "t": "발음",
//             "p": "가라이피다"
//         },
//         {
//             "t": "활용",
//             "p": "가라이피여"
//         },
//         {
//             "t": "활용",
//             "p": "가라이피니"
//         }
//     ],
//     "S": [{
//         "d": "입고 있던 옷을 벗고 다른 옷으로 바꾸어 입게 하다.",
//         "S": [
//             {
//                 "t": "구",
//                 "e1": "깨끗한 옷으로 갈아입히다."
//             },
//             {
//                 "t": "구",
//                 "e1": "새 옷으로 갈아입히다."
//             },
//             {
//                 "t": "구",
//                 "e1": "환자복으로 갈아입히다."
//             },
//             {
//                 "t": "문장",
//                 "e1": "잘 시간이 되어 엄마는 아이를 잠옷으로 갈아입혔다."
//             },
//             {
//                 "t": "문장",
//                 "e1": "간호사가 새로 입원하게 된 환자에게 환자복으로 갈아입힐 준비를 했다."
//             },
//             {
//                 "t": "대화",
//                 "e1": "아기가 바지에 오줌을 쌌어요.",
//                 "e2": "얼른 목욕시키고 옷을 갈아입혀야겠네."
//             }
//         ],
//         "E": [
//             {
//                 "l": "몽골어",
//                 "le": "сольж өмсүүлэх",
//                 "d": "өмсч байсан хувцасыг нь тайлж өөр хувцасаар сольж өмсгүүлэх."
//             },
//             {
//                 "l": "베트남어",
//                 "le": "cho thay, bắt thay (quần áo)",
//                 "d": "Cởi quần áo đang mặc ra và cho đổi sang mặc quần áo khác."
//             },
//             {
//                 "l": "타이어",
//                 "le": "เปลี่ยนชุดให้, เปลี่ยนเสื้อผ้าให้, เปลี่ยนใส่ชุดใหม่ให้",
//                 "d": "ทำให้ถอดเสื้อผ้าที่ใส่อยู่และเปลี่ยนใส่เสื้อผ้าชุดอื่น"
//             },
//             {
//                 "l": "인도네시아어",
//                 "le": "menggantikan baju",
//                 "d": "melepaskan baju yang dipakai seseorang kemudian menggantikannya dengan yang lain"
//             },
//             {
//                 "l": "러시아어",
//                 "le": "переодеть",
//                 "d": "Снять одежду и надеть другую. "
//             },
//             {
//                 "l": "영어",
//                 "le": "change someone's clothes",
//                 "d": "To have someone take off his/her clothes and put on other clothes."
//             },
//             {
//                 "l": "일본어",
//                 "le": "きがえさせる【着替えさせる】",
//                 "d": "着ている服を脱がせて、別の服に替えて着せる。"
//             },
//             {
//                 "l": "프랑스어",
//                 "le": "changer, habiller, vêtir",
//                 "d": "Enlever un vêtement que porte quelqu'un, et lui en faire porter un autre."
//             },
//             {
//                 "l": "스페인어",
//                 "le": "hacer cambiar",
//                 "d": "Obligar a mudarse de ropa."
//             },
//             {
//                 "l": "아랍어",
//                 "le": "يُغيّر ملابسه",
//                 "d": "يَخلع ملابسه ويرتدي ملابس أخرى"
//             },
//             {
//                 "l": "중국어",
//                 "le": "换，改换",
//                 "d": "让对方把身上的衣服脱掉，改穿别的衣服。"
//             }
//         ]
//     }]
// }

const SearchResultScreen = (props) => {
  const data = props.navigation.getParam('searchResultData', 'nothing sent');
  const { t, i18n } = useTranslation();
  const ee = new NativeEventEmitter(NativeModules.TextToSpeech);
  ee.addListener('tts-start', () => { });
  ee.addListener('tts-finish', () => { });
  ee.addListener('tts-cancel', () => { });

  const [wordInfo, setWordInfo] = useState([]);

  const getWordInfo = () => {
    const query = `SELECT words_info.id, words_info.lemma, words_info.partofspeech, words_info.origin, words_info.vocabularyLevel, words_info.lexicalUnit,
            words_info.homonym_number, words_info.annotation,

              (select
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', words_en.sense_id, 'en_lm', words_en.en_lm, 'en_def', words_en.en_def)))
              FROM words_en where words_en.id = 16391
              )
              AS sense,

              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('type', rel_form.type, 'writtenForm', rel_form.writtenForm)))
              FROM rel_form where rel_form.rel_form_id = 16391
              )
              AS relatedForm,
            
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', words_ex.sense_id, 'type', words_ex.type, 'example_1', words_ex.example_1,  'example_2', words_ex.example_2 ))) 
              FROM words_ex where words_ex.id = 16391
              )
              AS senseExample,
            
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('lemma', words_app.lemma, 'writtenForm', words_app.writtenForm)))
              FROM words_app where words_app.id = 16391
              )
              AS wordForm,

              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('lemma', idioms_info.lemma, 'lexicalUnit', idioms_info.lexicalUnit)))
              FROM idioms_info where idioms_info.id = 16391
              )
              AS idiomInfo,
                
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', idioms_en.sense_id,'lemma', idioms_en.lemma,  'en_lm', idioms_en.en_lm, 'en_def', idioms_en.en_def)))
              FROM idioms_en where idioms_en.id = 16391
              )
              AS idiomsSense,
                
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', idioms_ex.sense_id,  'example_1', idioms_ex.example_1, 'lemma', idioms_ex.lemma,  'example_2', idioms_ex.example_2, 'example_id', idioms_ex.example_id, 'type', idioms_ex.type )))
              FROM idioms_ex where idioms_ex.id = 16391
              )
              AS idiomsSenseSample,
                
              (select 
              JSON_GROUP_ARRAY(DISTINCT(json_object('sense_id', idioms_def.sense_id,'lemma', idioms_def.lemma,  'syntacticPattern', idioms_def.syntacticPattern)))
              FROM idioms_def where idioms_def.id = 16391
              )
              AS idiomsDef
          
            FROM words_info 
            WHERE  words_info.id =16391 `;

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        let row = results.rows.item(0);
        setWordInfo(row);
        // console.log(row)
      });
    });
  };

  useEffect(() => {
    getWordInfo();
  }, []);

  console.log('len : ',wordInfo?.idiomInfo);

  //detect if the user put is korean
  const isKoreanWord = (text) => {
    const re = /[\u3131-\uD79D]/g;
    const match = text.match(re);
    return match ? match.length === text.length : false;
  };

  //render idioms from sense
  const renderIdiomsData = (idioms) => {
    // console.log(idioms)
    try {
      let arr = JSON.parse(idioms);
      console.log(arr)
      return arr.map((data, i) => {
        return (
          <>
            <View style={{ flexDirection: 'row' }} key={`${i + data?.en_lm}`}>
              <Text style={{ fontSize: 17 }}>{data.sense_id}.</Text>
              <View>
                <Text
                  style={{
                    color: Constants.appColors.PRIMARY_COLOR,
                    fontSize: 17,
                  }}>{`${data?.en_lm}; `}</Text>
              </View>
            </View>
            {renderSeneDefData(wordInfo.sense, data.sense_id)}
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
            <View style={{ flexDirection: 'row' }} key={`${i + data?.en_lm}`}>
              <Text style={{ fontSize: 17 }}>{data.sense_id}.</Text>
              <View>
                <Text
                  style={{
                    color: Constants.appColors.PRIMARY_COLOR,
                    fontSize: 17,
                  }}>{`${data?.en_lm}; `}</Text>
              </View>
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
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    width: Sizes.WINDOW_WIDTH - 64,
                  }}>{`${data?.en_def}`}</Text>
              </View>

              <View style={{ marginLeft: 12 }}>
                <ReadMore
                  seeMoreStyle={{ color: Constants.appColors.PRIMARY_COLOR }}
                  seeLessStyle={{ color: Constants.appColors.PRIMARY_COLOR }}>
                  {renderSenseExampleData(
                    wordInfo.senseExample,
                    data?.sense_id,
                  )}
                </ReadMore>
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
            <View style={{ height: 40 }} key={`${i + data?.example_1}`}>
              {data?.example_1 && <Text>{`${data.example_1} ,`}</Text>}
              {data?.example_2 && <Text>{`${data.example_2} ,`}</Text>}
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
          console.log('Applications : ', arr);
          if (data?.lemma != 'undefined' || data?.lemma != 'null') {
            return (
              data?.writtenForm && (
                <View key={i + data?.p} style={{ marginHorizontal: 2 }}>
                  <Text>{`${data && data?.writtenForm},`}</Text>
                </View>
              )
            );
          } else {
            return <Text></Text>;
          }
        } else if (type == 2) {
          console.log('Derivatives : ', arr);
          if (data?.type != 'undefined' || data?.type != 'null') {
            return (
              data?.writtenForm && (
                <View key={i} style={{ marginHorizontal: 2 }}>
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
        <SearchHeader
          title=""
          leftIcon={`${t('SearchText')}`}
          show={true}
          onPressleftIcon={() =>
            props.navigation.dispatch(NavigationActions.back())
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
        />
      </View>
      <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Constants.appColors.LIGHTGRAY,
            paddingVertical: 10,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>
              {data?.lemma}
            </Text>
            <Text style={{ fontSize: 24, color: 'black', fontWeight: '500' }}>
              {data?.origin && `(${data?.origin})`}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ paddingRight: 6 }}>{data?.partofspeech}</Text>
            <Text>{data?.partofspeech}</Text>
          </View>
        </View>
        {data?.wordForm?.writtenForm && data?.wordForm?.relatedForm && (
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
                    marginRight: 8,
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
        )}
      </View>
      {wordInfo?.sense && wordInfo?.senseExample && (
        <>
          <View
            style={{
              backgroundColor: '#f8f8f8',
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}>
            <Text style={{ fontSize: 16 }}>{`${t('DefinitionText')}`}</Text>
          </View>
          <View style={{ backgroundColor: 'white' }}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{
                marginBottom: Sizes.WINDOW_WIDTH * 0.45,
                paddingHorizontal: 12,
              }}>
              <View>{renderSeneData(wordInfo?.sense)}</View>
              {
                wordInfo?.idiomInfo.length != 0 &&
                <View style={{
                  borderWidth: 2
                }}>
                  <View
                    style={{
                      backgroundColor: '#f8f8f8',
                      paddingHorizontal: 0,
                      paddingVertical: 4,
                    }}>
                    <Text style={{ fontSize: 16 }}>{`${t('idiomsText')}`}</Text>
                  </View>
                  <View>{wordInfo?.idiomInfo && renderIdiomsData(wordInfo?.idiomInfo)}</View>
                </View>
              }
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

SearchResultScreen.navigationOptions = {
  headerShown: false,
};

export default SearchResultScreen;
