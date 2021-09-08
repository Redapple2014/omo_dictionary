import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, ScrollView } from 'react-native';
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
// const data = {
//     "_id": "64523",
//     "homonym_number": 0,
//     "lexicalUnit": "단어",
//     "partOfSpeech": "형용사",
//     "vocabularyLevel": "초급",
//     "semanticCategory": "개념 > 모양",
//     "Lemma": {
//         "writtenForm": "높다"
//     },
//     "WordForm": [
//         {
//             "type": "발음",
//             "pronunciation": "놉따",
//             "sound": "https://dicmedia.korean.go.kr/multimedia/sound_file/nieun_2005/noptta.wav"
//         },
//         {
//             "type": "활용",
//             "writtenForm": "높은",
//             "pronunciation": "노픈",
//             "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/17000/64523_nopeun.wav"
//         },
//         {
//             "type": "활용",
//             "writtenForm": "높아",
//             "pronunciation": "노파",
//             "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/17000/64523_nopa.wav"
//         },
//         {
//             "type": "활용",
//             "writtenForm": "높으니",
//             "pronunciation": "노프니",
//             "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/17000/64523_nopeuni.wav"
//         },
//         {
//             "type": "활용",
//             "writtenForm": "높습니다",
//             "pronunciation": "놉씀니다",
//             "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/20000/17000/64523_nopsseumnida.wav"
//         }
//     ],
//     "RelatedForm": [
//         {
//             "type": "파생어",
//             "id": "85176",
//             "writtenForm": "높이다"
//         }
//     ],
//     "Sense": [
//         {
//             "id": 1,
//             "definition": "아래에서 위까지의 길이가 길다.",
//             "syntacticPattern": "1이 높다",
//             "SenseRelation": [
//                 {
//                     "type": "반대말",
//                     "id": 58155,
//                     "lemma": "낮다",
//                     "homonymNumber": 0
//                 }
//             ],
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "높은 빌딩."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "높은 파도."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "건물이 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "구두 굽이 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "산이 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "구",
//                     "example_1": "울타리가 높다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "구",
//                     "example_1": "콧날이 높다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "문장",
//                     "example_1": "이 나무는 하늘에 닿을 정도로 크고 높다."
//                 },
//                 {
//                     "id": 9,
//                     "type": "문장",
//                     "example_1": "저 높은 곳에서부터 시냇물이 흘러 내려온다."
//                 },
//                 {
//                     "id": 10,
//                     "type": "문장",
//                     "example_1": "담장이 높아서 담장 너머로 집 안이 잘 보이지 않는다."
//                 },
//                 {
//                     "id": 11,
//                     "type": "대화",
//                     "example_1": "일기 예보를 보니 내일 태풍이 올 거라고 하더라.",
//                     "example_2": "응. 내일 파도가 높게 인다는데 되도록 배를 타지 말자고."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр",
//                     "definition": "доороос дээш хүртэлх хэмжээ нь урт байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Chiều dài từ dưới lên trên dài."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "สูง",
//                     "definition": "ความยาวจากด้านล่างจนถึงด้านบนมีความยาว"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi",
//                     "definition": "panjang sesuatu dari bawah sampai atas"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; возвышенный",
//                     "definition": "Имеющий большую высоту от низа до верха."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high; lofty",
//                     "definition": "The length from bottom to top being long."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "下から上までの間が長い。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "haut, élevé, grand",
//                     "definition": "(Longueur de bas en haut) Qui est long."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alto, elevado",
//                     "definition": "Que tiene gran extensión en sentido vertical."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "مرتفع",
//                     "definition": "طول طويل من أعلى لأسفل"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高",
//                     "definition": "上下距离较长。"
//                 }
//             ]
//         },
//         {
//             "id": 2,
//             "definition": "아래에서 위까지의 벌어진 사이가 크다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "구름이 높다."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "달이 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "별이 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "옥상이 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "지붕이 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "구",
//                     "example_1": "지세가 높다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "구",
//                     "example_1": "지형이 높다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "문장",
//                     "example_1": "줄이 끊어진 연이 하늘로 높게 올라갔다."
//                 },
//                 {
//                     "id": 9,
//                     "type": "문장",
//                     "example_1": "지수는 의자에 올라서서 높은 찬장에 있는 그릇을 꺼냈다."
//                 },
//                 {
//                     "id": 10,
//                     "type": "대화",
//                     "example_1": "내 동생은 이 천장에 손끝이 닿아.",
//                     "example_2": "이 높은 천장에 말이야? 동생의 키가 정말 크구나."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр, хол",
//                     "definition": "доороос дээш хүртэлх зай их байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Khoảng cách từ dưới lên trên lớn."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "สูง, อยู่สูง",
//                     "definition": "ระยะห่างจากด้านล่างจนถึงด้านบนห่างมาก"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi",
//                     "definition": "jarak yang terbentang dari bawah sampai atas"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий",
//                     "definition": "Имеющий большой промежуток от низа до верха."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high",
//                     "definition": "The space from bottom to top being large."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "下から上までの開きが大きい。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "(Pas d'expression équivalente)",
//                     "definition": "(Distance entre le bas et le haut) Qui est grande."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alto, elevado",
//                     "definition": "Que presenta una gran brecha entre el extremo superior y el inferior."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "مرتفع",
//                     "definition": "الفجوة بين الأعلى والأسفل كبيرة"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高，高远",
//                     "definition": "上下相隔的距离较远。"
//                 }
//             ]
//         },
//         {
//             "id": 3,
//             "definition": "온도, 습도, 압력 등이 정해진 기준보다 위에 있다.",
//             "syntacticPattern": "1이 높다",
//             "SenseRelation": [
//                 {
//                     "type": "반대말",
//                     "id": 58155,
//                     "lemma": "낮다",
//                     "homonymNumber": 0
//                 }
//             ],
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "높은 기온."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "수온이 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "압력이 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "전압이 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "체온이 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "문장",
//                     "example_1": "바다 깊숙한 곳으로 들어갈수록 수압이 높다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "문장",
//                     "example_1": "감기에 걸린 아이는 밤새 높은 열로 끙끙 앓았다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "문장",
//                     "example_1": "아버지는 다른 사람들보다 혈압이 높으셔서 혈압 약을 복용하신다."
//                 },
//                 {
//                     "id": 9,
//                     "type": "대화",
//                     "example_1": "이것 봐. 여기 타일에 곰팡이가 끼었어.",
//                     "example_2": "저런, 화장실의 습도가 높아서 그런가 보다. 얼른 제거하자."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр, илүү",
//                     "definition": "хэм, чийг, даралт зэрэг тогтсон жишгээс дээр байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Nhiệt độ, độ ẩm, áp lực ở trên tiêu chuẩn đã định."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(อุณหภูมิ, ความชื้น, ความกดดัน)สูง",
//                     "definition": "อยู่สูงกว่ามาตรฐานของอุณหภูมิ ความชื้นหรือความกดดัน เป็นต้น ที่ถูกกำหนดไว้"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi",
//                     "definition": "suhu, kelembaban, tekanan, dsb ada di atas dari standar yang telah ditentukan"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий",
//                     "definition": "Находящийся выше определённого уровня (о температуре, влажности, давлении и т.п.)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high",
//                     "definition": "The temperature, humidity, pressure, etc., being higher than normal."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "温度、湿度、圧力などが定められた基準より上にある。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "élevé, fort, haut",
//                     "definition": "(température, taux d'humidité, pression, etc.) Inférieur au critère fixé."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "de nivel elevado, de alto grado",
//                     "definition": "Dícese de la temperatura, la humedad, la presión, etc. que supera el estándar establecido."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "مرتفع",
//                     "definition": "تكون درجة الحرارة أو الرطوبة أو الضغط أعلى من المعيار المحدد"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高，大",
//                     "definition": "温度、湿度、压力等在规定的基准之上。"
//                 }
//             ]
//         },
//         {
//             "id": 4,
//             "definition": "품질이나 수준 또는 능력이나 가치가 보통보다 위에 있다.",
//             "syntacticPattern": "1이 높다",
//             "SenseRelation": [
//                 {
//                     "type": "반대말",
//                     "id": 58155,
//                     "lemma": "낮다",
//                     "homonymNumber": 0
//                 }
//             ],
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "가치가 높다."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "강도가 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "격조가 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "교양이 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "기품이 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "구",
//                     "example_1": "덕이 높다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "구",
//                     "example_1": "만족도가 높다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "구",
//                     "example_1": "빈도가 높다."
//                 },
//                 {
//                     "id": 9,
//                     "type": "구",
//                     "example_1": "서열이 높다."
//                 },
//                 {
//                     "id": 10,
//                     "type": "구",
//                     "example_1": "성적이 높다."
//                 },
//                 {
//                     "id": 11,
//                     "type": "구",
//                     "example_1": "소득이 높다."
//                 },
//                 {
//                     "id": 12,
//                     "type": "구",
//                     "example_1": "수준이 높다."
//                 },
//                 {
//                     "id": 13,
//                     "type": "구",
//                     "example_1": "안목이 높다."
//                 },
//                 {
//                     "id": 14,
//                     "type": "구",
//                     "example_1": "연봉이 높다."
//                 },
//                 {
//                     "id": 15,
//                     "type": "구",
//                     "example_1": "인품이 높다."
//                 },
//                 {
//                     "id": 16,
//                     "type": "구",
//                     "example_1": "의존도가 높다."
//                 },
//                 {
//                     "id": 17,
//                     "type": "구",
//                     "example_1": "적응력이 높다."
//                 },
//                 {
//                     "id": 18,
//                     "type": "구",
//                     "example_1": "지명도가 높다."
//                 },
//                 {
//                     "id": 19,
//                     "type": "구",
//                     "example_1": "품질이 높다."
//                 },
//                 {
//                     "id": 20,
//                     "type": "구",
//                     "example_1": "학력이 높다."
//                 },
//                 {
//                     "id": 21,
//                     "type": "구",
//                     "example_1": "학식이 높다."
//                 },
//                 {
//                     "id": 22,
//                     "type": "구",
//                     "example_1": "현실성이 높다."
//                 },
//                 {
//                     "id": 23,
//                     "type": "구",
//                     "example_1": "효과가 높다."
//                 },
//                 {
//                     "id": 24,
//                     "type": "문장",
//                     "example_1": "이 수학 문제는 난이도가 매우 높아서 풀기 어렵다."
//                 },
//                 {
//                     "id": 25,
//                     "type": "문장",
//                     "example_1": "몸살이 났을 때는 아무쪼록 영양가가 높은 음식을 먹고 잘 쉬는 편이 좋다."
//                 },
//                 {
//                     "id": 26,
//                     "type": "문장",
//                     "example_1": "이 영화는 국제 영화제에서 큰 상을 받은 영화로 작품성이 높다고 알려져 있다."
//                 },
//                 {
//                     "id": 27,
//                     "type": "문장",
//                     "example_1": "그 배우는 이번 영화에서 비중이 높은 조연을 맡아 연기하여서 주인공만큼 유명해졌다."
//                 },
//                 {
//                     "id": 28,
//                     "type": "대화",
//                     "example_1": "이 술은 도수가 높은데 마셔도 괜찮겠어?",
//                     "example_2": "그래? 그러면 많이 취하지 않도록 조금만 마실게."
//                 },
//                 {
//                     "id": 29,
//                     "type": "대화",
//                     "example_1": "정말 이 주식 종목이 오름세에 있다는 게 맞니? 투자해도 괜찮은 거야?",
//                     "example_2": "그럼. 신빙성이 높은 소문이니 한번 믿고 투자해 봐."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр",
//                     "definition": "чанар, түвшин, чадвар, үнэ цэнэ мэт ердийнхөөс дээгүүр байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Chất lượng, tiêu chuẩn, năng lực hay giá trị ở trên mức thông thường."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(คุณภาพ, มาตรฐาน, ความสามารถ, คุณค่า)สูง",
//                     "definition": "คุณภาพ มาตรฐาน ความสามารถหรือคุณค่าสูงกว่าปกติ"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi",
//                     "definition": "kualitas atau standar, kemampuan atau nilai berada di atas daripada biasanya"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий",
//                     "definition": "Находящийся выше среднего уровня (о качестве, стандарте, способностях или ценностях)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high",
//                     "definition": "The quality, level, ability, or value being higher than the average."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "品質や水準、または能力や価値が普通より上にある。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "élevé",
//                     "definition": "(Qualité, niveau, capacité ou valeur) Supérieur à la moyenne."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "de nivel elevado, de alto grado",
//                     "definition": "Dícese de la calidad, el nivel, la habilidad o el valor de algo o alguien que supera el promedio."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "عال",
//                     "definition": "تكون الجودة أو المستوى او القدرة او القيمة أعلى من المستوى المتوسط"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高，优秀",
//                     "definition": "质量、水平或能力、价值等在平均程度之上。"
//                 }
//             ]
//         },
//         {
//             "id": 5,
//             "definition": "값이나 비율이 보통보다 위에 있다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "높은 값."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "높은 합격률."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "금리가 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "물가가 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "시청률이 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "구",
//                     "example_1": "염분이 높다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "구",
//                     "example_1": "점유율이 높다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "구",
//                     "example_1": "주가가 높다."
//                 },
//                 {
//                     "id": 9,
//                     "type": "구",
//                     "example_1": "청취율이 높다."
//                 },
//                 {
//                     "id": 10,
//                     "type": "구",
//                     "example_1": "출산율이 높다."
//                 },
//                 {
//                     "id": 11,
//                     "type": "구",
//                     "example_1": "타율이 높다."
//                 },
//                 {
//                     "id": 12,
//                     "type": "구",
//                     "example_1": "투표율이 높다."
//                 },
//                 {
//                     "id": 13,
//                     "type": "문장",
//                     "example_1": "고급 매장에서는 품질이 좋고 가격이 높은 제품 위주로 판매한다."
//                 },
//                 {
//                     "id": 14,
//                     "type": "문장",
//                     "example_1": "이 회사는 복지 수준이 낮고 업무도 힘들어서 직원들의 이직률이 높다고 한다."
//                 },
//                 {
//                     "id": 15,
//                     "type": "문장",
//                     "example_1": "그 양궁 선수는 과녁 중앙에 모든 화살을 다 명중시킬 정도로 명중률이 높았다."
//                 },
//                 {
//                     "id": 16,
//                     "type": "대화",
//                     "example_1": "요즘은 이자율이 높아서 돈을 빌리기가 겁나.",
//                     "example_2": "맞아. 많은 이자를 내야 하니 선뜻 돈을 빌리지 못하겠더라."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр",
//                     "definition": "үнэ өртөг, харьцаа зэрэг ердийнхөөс дээгүүр байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Giá cả hay tỉ lệ ở trên mức thông thường."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(ราคา, อัตรา)สูง",
//                     "definition": "ราคาหรืออัตราอยู่สูงกว่าปกติ"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi",
//                     "definition": "harga atau persentase ada di atas dari biasanya"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; повышенный",
//                     "definition": "Находящийся выше среднего уровня (о стоимости или процентном уровне)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high; expensive",
//                     "definition": "A price or rate being higher than the average."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "値や割合などが普通より上にある。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "cher, élevé",
//                     "definition": "(Prix ou proportion) Supérieur à la moyenne."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "elevado, caro, alto",
//                     "definition": "Dícese del valor o el porcentaje de algo que supera el promedio."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "مرتفع",
//                     "definition": "يكون السعر او النسبة أعلى من المستوى المتوسط"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "贵，高",
//                     "definition": "价格或比例在普通程度之上。"
//                 }
//             ]
//         },
//         {
//             "id": 6,
//             "definition": "지위나 신분 등이 보통보다 위에 있다.",
//             "syntacticPattern": "1이 높다",
//             "SenseRelation": [
//                 {
//                     "type": "반대말",
//                     "id": 58155,
//                     "lemma": "낮다",
//                     "homonymNumber": 0
//                 }
//             ],
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "높은 벼슬."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "계급이 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "지위가 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "직위가 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "직책이 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "문장",
//                     "example_1": "민준이는 이번 달에 한 단계 더 높은 직급으로 승진하였다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "문장",
//                     "example_1": "많은 직원들이 분주히 청소하면서 높은 관료를 맞을 준비를 한다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "문장",
//                     "example_1": "계급 사회에서 신분이 높은 사람들은 낮은 신분의 사람들과 잘 교류하지 않았다."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр",
//                     "definition": "албан тушаал, зэрэг дэв зэрэг ердийнхөөс дээгүүр байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Địa vị hay thân phận ở trên mức thông thường."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(ฐานะ, ตำแหน่ง)สูง",
//                     "definition": "ฐานะหรือตำแหน่ง เป็นต้น อยู่สูงกว่าปกติ"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi, atas",
//                     "definition": "posisi atau status dsb ada di atas dari biasanya"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; возвышенный",
//                     "definition": "Находящийся выше среднего уровня (о статусе или социальном положении)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high-ranking; noble; exalted",
//                     "definition": "Someone's status or position being higher than the average."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "地位や身分などが普通より上にある。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "haut, élevé, éminent",
//                     "definition": "(Position, statut, etc.) Supérieur à la moyenne."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alto, noble",
//                     "definition": "Dícese del cargo o la posición social que ocupa alguien que se sitúa por encima del nivel medio."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "رفيع",
//                     "definition": "تكون المكانة أو المقام أعلى من المستوى المتوسط"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高，高贵，尊贵",
//                     "definition": "地位或身份等在普通程度之上。"
//                 }
//             ]
//         },
//         {
//             "id": 7,
//             "definition": "소리가 음의 차례에서 위쪽이거나 진동수가 크다.",
//             "syntacticPattern": "1이 높다",
//             "SenseRelation": [
//                 {
//                     "type": "반대말",
//                     "id": 58155,
//                     "lemma": "낮다",
//                     "homonymNumber": 0
//                 }
//             ],
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "높은 노랫소리."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "높은 억양."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "높은 음파."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "음성이 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "음조가 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "문장",
//                     "example_1": "그 소프라노는 목소리가 매우 높게 올라간다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "문장",
//                     "example_1": "이 노래는 박자가 빠르고 높은 음이 많아서 부르기가 어렵다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "문장",
//                     "example_1": "바이올린에서 흘러나오는 높고 낮은 가락이 애절하게 들린다."
//                 },
//                 {
//                     "id": 9,
//                     "type": "대화",
//                     "example_1": "어떻게 하면 높은 소리를 잘 낼 수 있을까?",
//                     "example_2": "음, 열심히 고음을 내는 연습을 하는 방법이 가장 좋을 것 같아."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр",
//                     "definition": "дуу чимээ зэрэг дээгүүр өнгөтэй байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Âm thanh ở phía trên trong thang âm hoặc tần số dao động lớn."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(เสียง)สูง, แหลม",
//                     "definition": "เสียงซึ่งอยู่สูงในลำดับของเสียงหรือจำนวนการสั่นสะเทือนเล็กน้อย"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi, atas",
//                     "definition": "suara berada di sebelah atas dari tangga nada atau berfrekuensi banyak"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; возвышенный; повышенный",
//                     "definition": "Высокий по звучанию или имеющий высокую частоту колебаний (о звуке, голосе и т.п.)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high-pitched",
//                     "definition": "A sound being at a high pitch or its number of vibrations being large."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "音が音階で上の方にあるか振動数が大きい。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "haut, sonore, aigu",
//                     "definition": "(Son) Situé dans les hautes notes ou qui a un grand nombre de vibrations."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alto, elevado, agudo",
//                     "definition": "Dicho de un sonido que corresponde al rango agudo de la escala musical o presenta mayor frecuencia de vibraciones acústicas."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "عالِي الصوت",
//                     "definition": "يكون الصوت عاليا في النبرة أو تكون الاهتزازات الصوتية كبيرة"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高",
//                     "definition": "声音处于音阶高处或振动频率较大。"
//                 }
//             ]
//         },
//         {
//             "id": 8,
//             "definition": "이름이나 명성이 널리 알려진 상태에 있다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "덕망이 높다."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "명망이 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "명성이 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "평판이 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "문장",
//                     "example_1": "그 소설가는 문필가로서 이름이 높고 유명하다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "문장",
//                     "example_1": "이 학교의 국문학과에서는 학계에서 명성이 높은 학자를 데려와서 특강을 열었다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "대화",
//                     "example_1": "내 동기생이 저 선배에게 자잘한 일로 심하게 혼이 났어.",
//                     "example_2": "그 선배는 원래 후배 괴롭히기로 악명이 높은 사람이야. 너도 조심해."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "алдартай, алдаршсан, нэртэй",
//                     "definition": "нэр алдар ихэд дэлгэрэн түгсэн байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "lừng lẫy",
//                     "definition": "Tên tuổi hay danh tiếng ở trạng thái được biết đến rộng rãi."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "มี(ชื่อ, ชื่อเสียง)มาก",
//                     "definition": "ชื่อหรือชื่อเสียงอยู่ในสภาพที่เป็นที่รู้จักอย่างทั่วถึง"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "terkenal",
//                     "definition": "nama atau reputasi berada dalam kondisi yang dikenal luas"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; возвышенный",
//                     "definition": "Широко известный (об имени или славе)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high; well-known",
//                     "definition": "Someone's name or fame being widely known."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "名前や名声が広く知れ渡っている状態だ。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "(Pas d'expression équivalente)",
//                     "definition": "(Nom ou réputation) Largement connu."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "popular, renombrado, elevado, alto, reputado",
//                     "definition": "Dícese de la popularidad o el renombre de alguien que presenta un alcance amplio."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "رفيع",
//                     "definition": "يكون الاسم أو السمعة معروفة بشكل واسع"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高，大",
//                     "definition": "名字或名声被广为人知。"
//                 }
//             ]
//         },
//         {
//             "id": 9,
//             "definition": "기운 등이 매우 세차고 대단한 상태에 있다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "기세가 높다."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "기운이 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "사기가 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "의기가 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "투지가 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "문장",
//                     "example_1": "이 지역에는 자녀들을 향한 부모들의 높은 교육열 때문에 학원들이 많다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "문장",
//                     "example_1": "의욕이 높은 민준이는 주변 사람들을 격려하며 열정적으로 일을 추진해 나갔다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "대화",
//                     "example_1": "이 반 학생들은 참 열심히 공부를 하네요.",
//                     "example_2": "네. 이 학생들의 열의가 참으로 높지요. 기대가 많이 돼요."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр, их",
//                     "definition": "хүч нөлөө зэрэг туйлын эрчтэй, мундаг байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao ngất, mạnh mẽ",
//                     "definition": "Những cái như khí thế ở trạng thái rất mạnh và ghê gớm."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(อารมณ์, ความปรารถนา)รุนแรง, แรงกล้า",
//                     "definition": "แรง เป็นต้น อยู่ในสภาพที่รุนแรงและมีมาก"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi, berkobar-kobar",
//                     "definition": "semangat dsb berada di situasi yang sangat kuat dan hebat"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; повышенный",
//                     "definition": "Находящийся в очень сильном и крепком состоянии (о духе и т.п.)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "strong",
//                     "definition": "The force of someone or something being great and powerful. "
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "勢いなどがとても強く、素晴らしい状態だ。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "(Pas d'expression équivalente)",
//                     "definition": "(Force, etc.) Très puissant et remarquable."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alzado, elevado, reforzado",
//                     "definition": "Dícese del espíritu o el vigor de algo o alguien que está elevado y fortalecido."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "عال",
//                     "definition": "تكون الطاقة عظيمة وقوية جدا"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高昂，高涨",
//                     "definition": "劲头等很强，处于旺盛的状态。"
//                 }
//             ]
//         },
//         {
//             "id": 10,
//             "definition": "어떤 의견이 다른 의견보다 많고 세다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "관심이 높다."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "비난의 소리가 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "여론이 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "원성이 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "우려가 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "구",
//                     "example_1": "지적이 높다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "문장",
//                     "example_1": "이번 재해에 대한 예방 대책이 부족했다는 비난이 높다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "문장",
//                     "example_1": "지도자의 사과를 요구하는 국민들의 소리가 높아만 가는 추세이다."
//                 },
//                 {
//                     "id": 9,
//                     "type": "대화",
//                     "example_1": "대통령님, 요즘 국방력을 강화해야 한다는 목소리가 높습니다.",
//                     "example_2": "그렇군. 국민들의 의견을 반영하여 군대와 국방비를 늘리는 편이 좋겠군."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр, их",
//                     "definition": "ямар нэг санал өөр нэг саналаас их хүчтэй байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao, nhiều",
//                     "definition": "Ý kiến nào đó nhiều và mạnh hơn ý kiến khác."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "มี(ความสนใจ, ความคิดเห็น)มาก",
//                     "definition": "ความคิดเห็นใด ๆ มีมากและรุนแรงกว่าความคิดเห็นอื่น"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi, banyak",
//                     "definition": "suatu pendapat lebih banyak dan kuat dari pendapat lainnya"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; повышенный",
//                     "definition": "Более многочисленный и сильный, чем другой (о мнении)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "strong",
//                     "definition": "An opinion being more predominant than others. "
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "ある意見が他の意見より多く、強い。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "(Pas d'expression équivalente)",
//                     "definition": "(Opinion) Plus nombreuse et plus forte qu'une autre."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "mayoritario, prioritario, alto",
//                     "definition": "Dícese de una opinión que predomina sobre otras en términos del número de adeptos, etc."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "عال",
//                     "definition": "رأي ما أقوى وأكثر (انتشارا) من الرأي الآخر"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高，强烈",
//                     "definition": "某种意见比其它意见多且强势。"
//                 }
//             ]
//         },
//         {
//             "id": 11,
//             "definition": "꿈이나 이상이 매우 크다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "높은 이상."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "기개가 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "꿈이 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "구",
//                     "example_1": "목표가 높다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "구",
//                     "example_1": "의기가 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "문장",
//                     "example_1": "전쟁터에 나가는 병사들의 사기가 높다."
//                 },
//                 {
//                     "id": 7,
//                     "type": "문장",
//                     "example_1": "이 학교의 학생들은 최고의 학교에 다닌다는 긍지가 높다."
//                 },
//                 {
//                     "id": 8,
//                     "type": "대화",
//                     "example_1": "이번에 김 선생님을 추모하는 의미로 고아들을 위한 장학 재단이 설립되었대.",
//                     "example_2": "응. 가난한 사람들을 위해 평생을 바치셨던 김 선생님의 높은 뜻을 기리고자 하는 취지이지."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "их",
//                     "definition": "мөрөөдөл, хүсэл туйлын их байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Mơ ước hay lí tưởng rất lớn."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(ความฝัน, อุดมการณ์)สูง, ยิ่งใหญ่",
//                     "definition": "ความฝันหรืออุดมการณ์ยิ่งใหญ่มาก"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi, menggunung",
//                     "definition": "impian dan idaman sangat besar"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; повышенный; возвышенный",
//                     "definition": "Очень большой (о мечте или идеале)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high",
//                     "definition": "One's dream or ideal being grand and ambitious."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "夢や理想がとても大きい。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "grand",
//                     "definition": "(Rêve ou idéal) Très grand."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alto, grande, ambicioso",
//                     "definition": "Dícese del sueño o el ideal de alguien muy grande."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "عال",
//                     "definition": "الحلم والمثل كبير جدا"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "远大，高远",
//                     "definition": "梦想或理想很大。"
//                 }
//             ]
//         },
//         {
//             "id": 12,
//             "definition": "소리의 세기가 세다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "소리가 높다."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "어조가 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "구",
//                     "example_1": "언성이 높다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "문장",
//                     "example_1": "화가 난 어머니의 언성이 높았다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "문장",
//                     "example_1": "자기 의견을 강하게 소리치는 토론자의 목소리가 쩌렁쩌렁 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "대화",
//                     "example_1": "어디서 노랫소리가 높게 들리네.",
//                     "example_2": "그러게. 누가 이 야밤에 노래를 크게 부르는 거지?"
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр, хүчтэй, их",
//                     "definition": "дууны хүч их байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "to, vang",
//                     "definition": "Độ lớn của âm thanh mạnh."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "(เสียง)สูง",
//                     "definition": "การเน้นหนักของเสียงมีมาก"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "keras",
//                     "definition": "kekuatan suara sangat besar atau kencang"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; повышенный",
//                     "definition": "Сильный по звучанию (о звуке)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "loud",
//                     "definition": "A sound being strong."
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "音のビットが強い。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "élevé",
//                     "definition": "(Intensité d'un son) Qui est fort."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alto, fuerte",
//                     "definition": "Dícese de un sonido que tiene gran intensidad."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "عال",
//                     "definition": "شدة الصوت شديدة"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "高",
//                     "definition": "音量大。"
//                 }
//             ]
//         },
//         {
//             "id": 13,
//             "definition": "일어날 확률이나 가능성이 다른 것보다 많다.",
//             "annotation": "'가능성' 등의 말과 함께 쓴다.",
//             "syntacticPattern": "1이 높다",
//             "SenseExample": [
//                 {
//                     "id": 1,
//                     "type": "구",
//                     "example_1": "가능성이 높다."
//                 },
//                 {
//                     "id": 2,
//                     "type": "구",
//                     "example_1": "개연성이 높다."
//                 },
//                 {
//                     "id": 3,
//                     "type": "문장",
//                     "example_1": "부검을 한 의사는 이 사망자가 타살로 사망했을 가능성이 높다고 말했다."
//                 },
//                 {
//                     "id": 4,
//                     "type": "문장",
//                     "example_1": "빗길이나 눈길에서는 사고 위험이 높으니 운전에 조심해야 한다."
//                 },
//                 {
//                     "id": 5,
//                     "type": "문장",
//                     "example_1": "이 골목은 인적이 드물고 가로등이 어두워서 범죄 위험이 높다."
//                 },
//                 {
//                     "id": 6,
//                     "type": "대화",
//                     "example_1": "우리 팀이 이번 경기에서 이길 확률이 높을까?",
//                     "example_2": "음, 만약 우리가 상대 팀을 먼저 공격한다면 충분히 이길 가능성이 있다고 생각해."
//                 },
//                 {
//                     "id": 7,
//                     "type": "대화",
//                     "example_1": "면접 잘 봤니?",
//                     "example_2": "응, 예감이 좋아. 합격 가능성이 좀 높아 보여."
//                 }
//             ],
//             "Equivalent": [
//                 {
//                     "language": "몽골어",
//                     "lemma": "өндөр, их",
//                     "definition": "бий болох магадлал, боломж нь бусад зүйлээс их байх."
//                 },
//                 {
//                     "language": "베트남어",
//                     "lemma": "cao",
//                     "definition": "Xác suất hay khả năng xảy ra nhiều hơn cái khác."
//                 },
//                 {
//                     "language": "타이어",
//                     "lemma": "มี(ความเป็นไปได้, อัตราความเป็นไปได้)สูง",
//                     "definition": "อัตราความเป็นไปได้หรือความเป็นไปได้ที่จะเกิดขึ้นมีมากกว่าสิ่งอื่น"
//                 },
//                 {
//                     "language": "인도네시아어",
//                     "lemma": "tinggi",
//                     "definition": "presentase atau kemungkinan terjadinya banyak daripada yang lain"
//                 },
//                 {
//                     "language": "러시아어",
//                     "lemma": "высокий; повышенный",
//                     "definition": "Более высокий в сравнении с чем-либо другим (о проценте вероятности, возможности)."
//                 },
//                 {
//                     "language": "영어",
//                     "lemma": "high",
//                     "definition": "The probability or possibility of something happening being higher than that of another thing happening. "
//                 },
//                 {
//                     "language": "일본어",
//                     "lemma": "たかい【高い】",
//                     "definition": "起こる確率や可能性が他のものより高い。"
//                 },
//                 {
//                     "language": "프랑스어",
//                     "lemma": "très probable",
//                     "definition": "(Probabilité ou possibilité d'apparition d'une chose) Qui est plus grande que celle d'une autre."
//                 },
//                 {
//                     "language": "스페인어",
//                     "lemma": "alto, elevado",
//                     "definition": "Dícese de la probabilidad o la posibilidad de que algo suceda que es mayor que la de otros."
//                 },
//                 {
//                     "language": "아랍어",
//                     "lemma": "عال",
//                     "definition": "امكانية او احتمال الحدوث أعلى من الأشياء الأخرى"
//                 },
//                 {
//                     "language": "중국어",
//                     "lemma": "大",
//                     "definition": "发生的概率或可能性比其他多。"
//                 }
//             ]
//         }
//     ]
// }

const SearchResultScreen = (props) => {


    const data = props.navigation.getParam('searchResultData', 'nothing sent');


    console.log("searchResultData : ", data)

    const { t, i18n } = useTranslation();

    const renderEquivalent = (dataSet) => {
        let arr = dataSet
        if(arr!='undefined'){
        
        return arr.map((data, i) => {
            if (data.language == '몽골어')
                return (<View key={`${i + data?.lemma}`}><Text style={{ color: Constants.appColors.PRIMARY_COLOR, fontSize: 18 }}>{`${data?.lemma}`}</Text><Text style={{ marginVertical: 4 }}>{`${data?.definition}`}</Text></View>
                )
        })}
        else{
            return (<></>)
        }
    }

    const renderSenseExample = (dataSet) => {
        if(dataSet!='undefined'){
        let arr = dataSet
        return arr.map((data, i) => {
            return (<View key={`${i + data?.example_1}`} style={{ marginVertical: 4, }}><Text style={{ color: Constants.appColors.PRIMARY_COLOR, fontWeight: 'bold', fontSize: 12 }}>{`${data?.example_1}; `}</Text></View>)
        })
        }else{
            return
        }

    }

    const renderData = (type, dataSet) => {
        let arr = dataSet
        if(dataSet!='undefined'){
        return arr.map((data, i) => {
            if (type == 1) {
                if (data?.type == "활용" && data?.writtenForm != 'undefined') {
                    return (
                        <View key={i} style={{ marginHorizontal: 2 }}><Text>{`${data && data?.writtenForm},`}</Text></View>
                    )
                }
                else {
                    return (<Text> No Data</Text>)
                }
            } else if (type == 2) {
                if (data?.type == "파생어" && data?.writtenForm != 'undefined') {
                    return (
                        <View key={i} style={{ marginHorizontal: 2 }}><Text>{`${data && data?.writtenForm},`}</Text></View>
                    )
                }
                else {
                    return (<></>)
                }
            }
            else if (type == 3) {
                return (
                    data?.SenseExample && data?.Equivalent &&
                    <View style={{ borderBottomWidth: .7, borderBottomColor: Constants.appColors.LIGHTGRAY, paddingBottom: 4 }}>
                        <View key={i} style={{ marginHorizontal: 4, flexDirection: 'row' }}><Text style={{ fontSize: 17, marginTop: 2 }}>{`${i + 1} `}</Text>
                            {
                               data?.Equivalent && renderEquivalent(data?.Equivalent)
                            }
                        </View>

                        <View key={`${i + data?.id}`} style={{ marginHorizontal: 16 }}>
                            {
                                data?.SenseExample && renderSenseExample(data?.SenseExample)

                            }

                        </View>
                    </View>

                )
            }
            else {
                return (<></>)
            }
        })}
        else{
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
                    onPressleftIcon={() =>
                        props.navigation.dispatch(NavigationActions.back())
                    }
                    onSoundPlay={() => {
                        try {
                            // AudioPlayer.prepare(data.WordForm[0].sound, () => AudioPlayer.play());
                            Tts.speak(data?.Lemma?.writtenForm)
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
                        <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>{data?.Lemma?.writtenForm}</Text>
                        <Text style={{ fontSize: 24, color: 'black', fontWeight: '500' }}>{data?.origin && `(${data?.origin})`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ paddingRight: 6 }}>{data?.partOfSpeech}</Text>
                        <Text>{data.vocabularyLevel}</Text>
                    </View>
                </View>
                { data?.RelatedForm && data?.WordForm &&
                    <View style={{ marginVertical: 10 }}>
                        <View style={{ flexDirection: 'row' }}><View style={{ backgroundColor: '#3D9CE0', height: 22, width: '30%', alignItems: 'center', borderRadius: 10 }}><Text style={{ marginRight: 8, textAlign: 'center', color: 'white', marginHorizontal: 8 }}>Applications</Text></View>{data?.WordForm && renderData(1, data?.WordForm)}</View>
                        <View style={{ marginTop: 8, flexDirection: 'row' }}><View style={{ backgroundColor: '#5ED65C', height: 22, width: '30%', alignItems: 'center', borderRadius: 10 }}><Text style={{ marginRight: 8, textAlign: 'center', color: 'white', marginHorizontal: 8 }}>Derivatives</Text></View>{data?.RelatedForm && renderData(2, data?.RelatedForm)}</View>
                    </View>
                }

            </View>
            { data?.Sense && data?.SenseExample && data?.Equivalent && <>
            <View style={{ backgroundColor: '#f8f8f8', paddingHorizontal: 16, paddingVertical: 4 }}><Text style={{ fontSize: 16 }}>Definitions</Text></View>
            <View style={{ backgroundColor: 'white' }}>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ marginBottom: Sizes.WINDOW_WIDTH * .625, paddingHorizontal: 12 }}>{data?.Sense && renderData(3, data.Sense)}</ScrollView>
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
