import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import SearchHeader from "../../components/searchHeader";
import { NavigationActions } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import AudioPlayer from 'react-native-play-audio';

const data = {
    "_id": "45281",
    "homonym_number": 0,
    "lexicalUnit": "단어",
    "partOfSpeech": "명사",
    "origin": "農閑期",
    "vocabularyLevel": "없음",
    "Lemma": {
        "writtenForm": "농한기"
    },
    "WordForm": [
        {
            "type": "발음",
            "pronunciation": "농한기",
            "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/40000/33000/45281_nonghangi.wav"
        }
    ],
    "Sense": [
        {
            "_id": 1,
            "definition": "농사일이 바쁘지 않아서 시간적인 여유가 많은 시기.",
            "SenseRelation": [
                {
                    "type": "반대말",
                    "_id": 43814,
                    "lemma": "농번기",
                    "homonymNumber": 0
                }
            ],
            "SenseExample": [
                {
                    "_id": 1,
                    "type": "구",
                    "example_1": "겨울의 농한기."
                },
                {
                    "_id": 2,
                    "type": "구",
                    "example_1": "농한기가 되다."
                },
                {
                    "_id": 3,
                    "type": "구",
                    "example_1": "농한기를 맞다."
                },
                {
                    "_id": 4,
                    "type": "구",
                    "example_1": "농한기를 보내다."
                },
                {
                    "_id": 5,
                    "type": "구",
                    "example_1": "농한기를 틈타다."
                },
                {
                    "_id": 6,
                    "type": "문장",
                    "example_1": "가을철 추수가 끝이 났으니 한동안 농한기에 들어가서 쉴 수 있다."
                },
                {
                    "_id": 7,
                    "type": "문장",
                    "example_1": "이 지역은 농한기임에도 불구하고 내년 농사 준비로 매우 분주한 모습이었다."
                },
                {
                    "_id": 8,
                    "type": "대화",
                    "example_1": "한 해 농사도 끝났는데 요즘 뭐하고 지내세요?",
                    "example_2": "농한기를 이용해서 새로운 작물 재배 방법을 배우러 다니고 있어."
                }
            ],
            "Equivalent": [
                {
                    "language": "몽골어",
                    "lemma": "газар тариалангийн ажил багатай үе",
                    "definition": "газар тариалангийн ажил бага, чөлөө завтай үе. "
                },
                {
                    "language": "베트남어",
                    "lemma": "thời kỳ nông nhàn",
                    "definition": "Thời kỳ công việc nhà nông không bận rộn, có nhiều thời gian dư dả."
                },
                {
                    "language": "타이어",
                    "lemma": "เวลานอกฤดูทำนา, ช่วงว่างจากการเกษตร, ฤดูว่างจากการเกษตร",
                    "definition": "ช่วงเวลาที่งานด้านการเกษตรไม่วุ่นวายจึงทำให้มีเวลามาก "
                },
                {
                    "language": "인도네시아어",
                    "lemma": "masa istirahat",
                    "definition": "periode ketika t_idak banyak kesibukan bertani sehingga banyak waktu luang"
                },
                {
                    "language": "러시아어",
                    "lemma": "время отдыха от сельскохозяйственных работ",
                    "definition": "Время года, когда невозможно выращивать сельскохозяйственную продукцию."
                },
                {
                    "language": "영어",
                    "lemma": "agricultural off-season",
                    "definition": "A period during which farmers have little work and lots of time on their hands."
                },
                {
                    "language": "일본어",
                    "lemma": "のうかんき【農閑期】",
                    "definition": "農作業がひまで時間的余裕のある時期。"
                },
                {
                    "language": "프랑스어",
                    "lemma": "morte-saison agricole ",
                    "definition": "Période pendant laquelle les agriculteurs ont beaucoup de temps libre, parce qu’ils ont peu de travaux agricoles à faire."
                },
                {
                    "language": "스페인어",
                    "lemma": "temporada baja ",
                    "definition": "Época de poco cultivo en la que los campesinos pueden descansar. "
                },
                {
                    "language": "아랍어",
                    "lemma": "فترة الفراغ من الزراعة",
                    "definition": "أوقات الفراغ بسبب عدم الانشغال بالأعمال الزراعية "
                },
                {
                    "language": "중국어",
                    "lemma": "农闲期",
                    "definition": "由于农事较少而闲暇时间较多的时期。"
                }
            ]
        }
    ]
}

const SearchResultScreen = (props) => {

    const { t, i18n } = useTranslation();

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <SearchHeader
                    title=''
                    leftIcon={`${t("SearchText")}`}
                    onPressleftIcon={() =>
                        props.navigation.dispatch(NavigationActions.back())
                    }
                    onSoundPlay={() => {
                        try {
                            AudioPlayer.prepare(data.WordForm[0].sound, () => AudioPlayer.play());
                        } catch (e) {
                            console.log(`cannot play the sound file`, e)
                        }
                    }}
                />

            </View>
            <View style={{ flex: 1,paddingHorizontal:16}}>
                <View style={{borderBottomWidth:.5,borderBottomColor:Constants.appColors.LIGHTGRAY,paddingVertical:10}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:24,color:'black',fontWeight:'bold'}}>{data.Lemma.writtenForm}</Text>
                        <Text style={{fontSize:24,color:'black',fontWeight:'500'}}>{`(${data.origin})`}</Text>
                    </View>
                    <View style={{flexDirection:'row'}} >
                        <Text style={{paddingRight:6}}>{data.partOfSpeech}</Text>
                        <Text>{data.vocabularyLevel}</Text>
                    </View>
                </View>

            </View>
        </View>
    )
}

SearchResultScreen.navigationOptions = {
    headerShown: false
}

export default SearchResultScreen;
