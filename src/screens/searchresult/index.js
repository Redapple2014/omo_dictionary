import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, ScrollView, NativeModules, NativeEventEmitter } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import SearchHeader from "../../components/searchHeader";
import { NavigationActions } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import Tts from 'react-native-tts';
import Toast from 'react-native-simple-toast';


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

    const [wordInfo, setWordInfo] = useState();
    const [wordApp, setWordApp] = useState();
    const [relForm, setRelForm] = useState();
    const [wordsEn, setWordsEn] = useState();
    const [wordsEx, setWordsEx] = useState();



    const getWordInfo = () => {
        const query = `SELECT *  from words_info where  words_info.id = ${data?.id}`
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                var len = results.rows.length;
                console.log('Query completed : ', len);
                var temp = [];
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    temp.push(row);
                }
                wordInfo(temp);
            });
        });
    }


    useEffect(()=>{
        getWordInfo()
    },[])




    // -- word info 
    // 

    // -- wordForm 
    // SELECT *  from words_app where  words_app.id = 14956 

    // -- relatedForm 
    // SELECT *  from rel_form where  rel_form.rel_form_id = 14956 

    // -- get Sense (lemma and definition)
    // SELECT *  from words_en where  words_en.id = 14956 

    // -- get SenseExample
    // SELECT *  from words_ex where  words_ex.id = 14956 





    //detect if the user put is korean
    const isKoreanWord = (text) => {
        const re = /[\u3131-\uD79D]/g;
        const match = text.match(re);
        return match ? match.length === text.length : false;
    };

    //render Equivalent from sense of each item
    const renderEquivalent = (dataSet) => {
        let arr = dataSet
        if (arr != 'undefined') {
            //console.log("renderSenseExample : ", arr)
            return arr.map((data, i) => {
                if (data.l == '몽골어') {
                    return (<View key={`${i + data?.le}`}><Text style={{ color: Constants.appColors.PRIMARY_COLOR, fontSize: 18 }}>{`${data?.le}`}</Text><Text style={{ marginVertical: 4 }}>{`${data?.d}`}</Text></View>
                    )
                }
            })
        }
        else {
            return (<></>)
        }
    }

    //render Sense Example from sense of each item
    const renderSenseExample = (dataSet) => {

        if (dataSet != 'undefined') {
            let arr = dataSet
            return arr.map((data, i) => {
                return (<View key={`${i + data?.e1}`} style={{ marginVertical: 4, }}><Text style={{ color: Constants.appColors.PRIMARY_COLOR, fontWeight: 'bold', fontSize: 12 }}>{`${data?.e1}; `}</Text></View>)
            })
        } else {
            return
        }

    }

    //render each item
    const renderData = (type, dataSet) => {
        let arr = dataSet
        if (dataSet != 'undefined') {
            return arr.map((data, i) => {
                if (type == 1) {
                    if (data?.t == "발음" && data?.p != 'undefined') {
                        return (
                            <View key={i + data?.p} style={{ marginHorizontal: 2 }}><Text>{`${data && data?.p},`}</Text></View>
                        )
                    }
                    else {
                        return (<Text></Text>)
                    }
                } else if (type == 2) {
                    if (data?.t == "파생어" && data?.p != 'undefined') {
                        return (
                            <View key={i} style={{ marginHorizontal: 2 }}><Text>{`${data && data?.p},`}</Text></View>
                        )
                    }
                    else {
                        return (<Text></Text>)
                    }
                }
                else if (type == 3) {

                    //console.log("searchResultData : ", data)
                    return (
                        data?.S && data?.E &&
                        <View style={{ borderBottomWidth: .7, borderBottomColor: Constants.appColors.LIGHTGRAY, paddingBottom: 4 }}>
                            <View key={i} style={{ marginHorizontal: 4, flexDirection: 'row' }}><Text style={{ fontSize: 17, marginTop: 2 }}>{`${i + 1} `}</Text>
                                {
                                    data?.E && renderEquivalent(data?.E)
                                }
                            </View>

                            <View key={`${i + data?.id}`} style={{ marginHorizontal: 16 }}>
                                {
                                    data?.S && renderSenseExample(data?.S)

                                }

                            </View>
                        </View>

                    )
                }
                else {
                    return (<></>)
                }
            })
        }
        else {
            return
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <SearchHeader
                    title=''
                    leftIcon={`${t("SearchText")}`}
                    show={true}
                    onPressleftIcon={() =>
                        props.navigation.dispatch(NavigationActions.back())
                    }
                    onSoundPlay={() => {
                        try {
                            Tts.setDefaultLanguage('ko-KR');
                            Tts.speak(data?.lemma)
                        } catch (e) {
                            //console.log(`cannot play the sound file`, e)
                            Toast.show(`${t("NoAudioFileFoundText")}`, Toast.SHORT);
                        }
                    }}
                />
            </View>
            <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
                <View style={{ borderBottomWidth: .5, borderBottomColor: Constants.appColors.LIGHTGRAY, paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>{data?.lemma}</Text>
                        <Text style={{ fontSize: 24, color: 'black', fontWeight: '500' }}>{data?.origin && `(${data?.origin})`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ paddingRight: 6 }}>{data?.partofspeech}</Text>
                        <Text>{data?.partofspeech}</Text>
                    </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <View style={{ flexDirection: 'row' }}><View style={{ backgroundColor: '#3D9CE0', height: 22, width: '30%', alignItems: 'center', borderRadius: 10 }}><Text style={{ marginRight: 8, textAlign: 'center', color: 'white', marginHorizontal: 8 }}>{`${t("ApplicationsText")}`}</Text></View>{data?.w && renderData(1, data?.w)}</View>
                    <View style={{ marginTop: 8, flexDirection: 'row' }}><View style={{ backgroundColor: '#5ED65C', height: 22, width: '30%', alignItems: 'center', borderRadius: 10 }}><Text style={{ marginRight: 8, textAlign: 'center', color: 'white', marginHorizontal: 8 }}>{`${t("DerivativesText")}`}</Text></View>{data?.r && renderData(2, data?.w)}</View>
                </View>
            </View>
            {data?.S && <>
                <View style={{ backgroundColor: '#f8f8f8', paddingHorizontal: 16, paddingVertical: 4 }}><Text style={{ fontSize: 16 }}>{`${t("DefinitionText")}`}</Text></View>
                <View style={{ backgroundColor: 'white' }}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ marginBottom: Sizes.WINDOW_WIDTH * .625, paddingHorizontal: 12 }}><Text>{data?.S && renderData(3, data.S)}</Text></ScrollView>
                </View>
            </>
            }
        </View>
    )
}

SearchResultScreen.navigationOptions = {
    headerShown: false
}

export default SearchResultScreen;
