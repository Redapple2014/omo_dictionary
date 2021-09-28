import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, ScrollView, NativeModules, NativeEventEmitter } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import SearchHeader from "../../components/searchHeader";
import { NavigationActions } from 'react-navigation';
import { useTranslation } from 'react-i18next';
// import AudioPlayer from 'react-native-play-audio';
import { sub } from 'react-native-reanimated';
import Tts from 'react-native-tts';
import Toast from 'react-native-simple-toast';


// const data = {"homonym_number":"0","lexicalUnit":"단어","partOfSpeech":"동사","vocabularyLevel":"없음","Lemma":{"writtenForm":"갈아입히다"},"WordForm":[{"type":"발음","pronunciation":"가라이피다","sound":"https://dicmedia.korean.go.kr/multimedia/sound_file/giyeok_2005/garaipida.wav"},{"type":"활용","writtenForm":"갈아입히어","pronunciation":"가라이피여","sound":"https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/18000/14769_garaipiyeo.wav","FormRepresentation":{"type":"준말","writtenForm":"갈아입혀","pronunciation":"가라이펴","sound":"https://dicmedia.korean.go.kr/multimedia/naver/2016/50000/46000/14769_garaipyeo.wav"}},{"type":"활용","writtenForm":"갈아입히니","pronunciation":"가라이피니","sound":"https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/18000/14769_garaipini.wav"}],"RelatedForm":[{"type":"가봐라","_id":"53830","writtenForm":"갈아입다"}],"Sense":[{"_id":"1","definition":"입고 있던 옷을 벗고 다른 옷으로 바꾸어 입게 하다.","syntacticPattern":"1이 2에게 3을 (4로) 갈아입히다","SenseExample":[{"_id":"1","type":"구","example_1":"깨끗한 옷으로 갈아입히다."},{"_id":"2","type":"구","example_1":"새 옷으로 갈아입히다."},{"_id":"3","type":"구","example_1":"환자복으로 갈아입히다."},{"_id":"4","type":"문장","example_1":"잘 시간이 되어 엄마는 아이를 잠옷으로 갈아입혔다."},{"_id":"5","type":"문장","example_1":"간호사가 새로 입원하게 된 환자에게 환자복으로 갈아입힐 준비를 했다."},{"_id":"6","type":"대화","example_1":"아기가 바지에 오줌을 쌌어요.","example_2":"얼른 목욕시키고 옷을 갈아입혀야겠네."}],"Equivalent":[{"language":"몽골어","lemma":"сольж өмсүүлэх","definition":"өмсч байсан хувцасыг нь тайлж өөр хувцасаар сольж өмсгүүлэх."},{"language":"베트남어","lemma":"cho thay, bắt thay (quần áo)","definition":"Cởi quần áo đang mặc ra và cho đổi sang mặc quần áo khác."},{"language":"타이어","lemma":"เปลี่ยนชุดให้, เปลี่ยนเสื้อผ้าให้, เปลี่ยนใส่ชุดใหม่ให้","definition":"ทำให้ถอดเสื้อผ้าที่ใส่อยู่และเปลี่ยนใส่เสื้อผ้าชุดอื่น"},{"language":"인도네시아어","lemma":"menggantikan baju","definition":"melepaskan baju yang dipakai seseorang kemudian menggantikannya dengan yang lain"},{"language":"러시아어","lemma":"переодеть","definition":"Снять одежду и надеть другую. "},{"language":"영어","lemma":"change someone's clothes","definition":"To have someone take off his/her clothes and put on other clothes."},{"language":"일본어","lemma":"きがえさせる【着替えさせる】","definition":"着ている服を脱がせて、別の服に替えて着せる。"},{"language":"프랑스어","lemma":"changer, habiller, vêtir","definition":"Enlever un vêtement que porte quelqu'un, et lui en faire porter un autre."},{"language":"스페인어","lemma":"hacer cambiar","definition":"Obligar a mudarse de ropa."},{"language":"아랍어","lemma":"يُغيّر ملابسه","definition":"يَخلع ملابسه ويرتدي ملابس أخرى"},{"language":"중국어","lemma":"换，改换","definition":"让对方把身上的衣服脱掉，改穿别的衣服。"}]}],"_id":"14769","_rev":"1-ec5c603a4b9a449a8c99ea32ac86d3fb"}

// const data = {"definition": [{"key": 0, "value": "Jccjcjc"}], "englishHeadWord": "gkvjfjg", "examples": [{"key": 0, "value": "N ncncnc"}], "hanja": "fjfjff", "koreanHeadWord": "hxxhd", "speech": "관형사"}

const ViewFlashcardDataScreen = (props) => {


    const data = props.navigation.getParam('item', 'nothing sent');
    // console.log('mydata: ',data)
    const ee = new NativeEventEmitter(NativeModules.TextToSpeech);
    ee.addListener('tts-start', () => { });
    ee.addListener('tts-finish', () => { });
    ee.addListener('tts-cancel', () => { });
    const { t, i18n } = useTranslation();

    //render the user's flash card data
    const renderData = () => {
        const arr = data.definition
        const arr2 = data.examples
        console.log(arr)
            return arr.map((data, i) => {
                        return (
                            <View key={i} style={{ marginHorizontal: 2,marginBottom:6 }}><Text style={{color:Constants.appColors.PRIMARY_COLOR}}>{`${data && data?.value},`}</Text><Text>{`Example- ${data && arr2[i].value}`}</Text></View>
                        )
                        })
    }



    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <SearchHeader
                    title=''         
                    show={true}
                    leftIcon={`${t("BackText")}`}
                    onPressleftIcon={() =>
                        props.navigation.dispatch(NavigationActions.back())
                    }
                    onSoundPlay={() => {
                        try {
                            Tts.setDefaultLanguage('ko-KR');
                            Tts.speak(data?.koreanHeadWord)
                        } catch (e) {
                            //console.log(`cannot play the sound file`, e)
                            Toast.show('No Audio File Found', Toast.SHORT);
                        }
                    }}
                />
            </View>
            <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
                <View style={{ borderBottomWidth: .5, borderBottomColor: Constants.appColors.LIGHTGRAY, paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>{data?.koreanHeadWord}</Text>
                        <Text style={{ fontSize: 24, color: 'black', fontWeight: '500' }}>{data?.englishHeadWord && `(${data?.englishHeadWord})`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ paddingRight: 6 }}>{data?.speech}</Text>
                        <Text>{data?.vocabularyLevel}</Text>
                    </View>
                </View>
            </View>
            {data?.definition  && <>
                <View style={{ backgroundColor: '#f8f8f8', paddingHorizontal: 16, paddingVertical: 8 }}><Text style={{ fontSize: 16 }}>{`${t("DefinitionText")}`}</Text></View>
                <View style={{ backgroundColor: 'white' }}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{  paddingHorizontal: 12 }}>{data?.definition && renderData()}</ScrollView>
                </View>
            </>
            }

        </View>
    )
}

ViewFlashcardDataScreen.navigationOptions = {
    headerShown: false
}

export default ViewFlashcardDataScreen;
