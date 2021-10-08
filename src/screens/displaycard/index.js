import React, { useState, useEffect } from 'react';
import { View, StatusBar, FlatList, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import Constants from '../../utills/Constants';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import AntDesign from "react-native-vector-icons/AntDesign";
import Sizes from '../../utills/Size';
import Toast from 'react-native-simple-toast';
import Tts from 'react-native-tts';
import {
    NAVIGATION_FLASH_CARD_DATA_SCREEN_PATH
} from '../../navigations/Routes';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import FIcons from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign'
import { CheckBox } from 'react-native-elements';
import PouchDB from 'pouchdb-react-native';
import { NAVIGATION_NEW_CARD_SCREEN_PATH } from '../../navigations/Routes';
import { NavigationEvents } from 'react-navigation';
import CustomPopup from '../../components/popup/CustomPopup';
import CustomButton from "../../components/button/CustomButton";
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

//const data = [{ "homonym_number": "0", "lexicalUnit": "단어", "partOfSpeech": "명사", "origin": "間奏曲", "vocabularyLevel": "없음", "Lemma": { "writtenForm": "간주곡" }, "WordForm": [{ "type": "발음", "pronunciation": "간ː주곡", "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/50000/46000/14157_gan-jugog.wav" }, { "type": "활용", "writtenForm": "간주곡이", "pronunciation": "간ː주고기", "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/50000/46000/14157_gan-jugogi.wav" }, { "type": "활용", "writtenForm": "간주곡도", "pronunciation": "간ː주곡또", "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/50000/46000/14157_gan-jugoktto.wav" }, { "type": "활용", "writtenForm": "간주곡만", "pronunciation": "간ː주공만", "sound": "https://dicmedia.korean.go.kr/multimedia/naver/2016/50000/46000/14157_gan-jugongman.wav" }], "Sense": [{ "_id": "1", "definition": "연극이나 오페라의 중간이나 막과 막 사이에 연주되는 음악.", "SenseExample": [{ "_id": "1", "type": "구", "example_1": "서정적인 간주곡." }, { "_id": "2", "type": "구", "example_1": "간주곡이 연주되다." }, { "_id": "3", "type": "구", "example_1": "간주곡이 이어지다." }, { "_id": "4", "type": "구", "example_1": "간주곡이 흐르다." }, { "_id": "5", "type": "구", "example_1": "간주곡이 흘러나오다." }, { "_id": "6", "type": "문장", "example_1": "오페라가 결론에 이르기 직전, 갑자기 공연이 멈추면서 간주곡이 흘러나왔다." }, { "_id": "7", "type": "문장", "example_1": "짧은 간주곡이 연주된 후 극의 흐름은 완전히 달라졌다." }, { "_id": "8", "type": "대화", "example_1": "이 오페라의 간주곡은 정말 조용하고 슬프다. ", "example_2": "응, 마치 주인공의 죽음을 암시하는 것 같아." }], "Equivalent": [{ "language": "몽골어", "lemma": "завсарлагаар тоглох хөгжим", "definition": "жүжиг болон дуурийн дундуур буюу үзэгдэл хооронд тоглодог хөгжим." }, { "language": "베트남어", "lemma": "khúc nhạc chuyển tiếp, khúc nhạc đệm", "definition": "Nhạc được tấu ở giữa các hồi hoặc giữa vở kịch hay vở Opera." }, { "language": "타이어", "lemma": "บทเพลงคั่น, บทเพลงสั้น ๆ ที่คั่นระหว่างการแสดง  ", "definition": "บทเพลงที่บรรเลงคั่นระหว่างองก์กับองก์หรือบรรเลงในระหว่างการแสดงโอเปร่าหรือละครเวที" }, { "language": "인도네시아어", "lemma": "intro, intermeso, musik selingan", "definition": "musik yang dimainkan di tengah-tengah drama atau opera " }, { "language": "러시아어", "lemma": "интермедия; интерлюдия", "definition": "Небольшое связующее музыкальное произведение, исполняемое между актами спектакля или оперы." }, { "language": "영어", "lemma": "interlude", "definition": "Music played in the middle of or between two acts of a play or opera." }, { "language": "일본어", "lemma": "かんそうきょく【間奏曲】。インテルメッツォ ", "definition": " 演劇やオペラの途中や幕間に演奏される音楽。" }, { "language": "프랑스어", "lemma": "interlude", "definition": "Musique instrumentale jouée entre deux actes ou au milieu d'une pièce de théâtre ou d'opéra." }, { "language": "스페인어", "lemma": "interludio, intermedio, entreacto", "definition": "Pieza o pasaje musical que se interpreta a modo de intermedio o entre dos actos de una representación teatral u ópera." }, { "language": "아랍어", "lemma": "موسيقى ملحّنة إضافية", "definition": "قطعة موسيقية فاصلة التي تعزف بين الفصلين في المسرحية أو أوبرا" }, { "language": "중국어", "lemma": "间奏曲，插曲", "definition": "话剧、歌剧的中间或者幕与幕之间演奏的音乐。" }] }, { "_id": "2", "definition": "규모가 큰 악곡의 중간에 삽입되어 연주되는 작은 규모의 기악곡.", "SenseExample": [{ "_id": "1", "type": "구", "example_1": "간주곡이 연주되다." }, { "_id": "2", "type": "구", "example_1": "간주곡이 이어지다." }, { "_id": "3", "type": "구", "example_1": "간주곡이 흐르다." }, { "_id": "4", "type": "구", "example_1": "간주곡을 듣다." }, { "_id": "5", "type": "구", "example_1": "간주곡을 작곡하다." }, { "_id": "6", "type": "문장", "example_1": "총 5장으로 이루어진 이 곡의 3장과 4장 사이에는 간주곡이 들어 있다." }, { "_id": "7", "type": "문장", "example_1": "중간에 간주곡이 연주되면서 곡의 전체적인 분위기가 바뀌었다." }], "Equivalent": [{ "language": "몽골어", "lemma": "завсрын хөгжим", "definition": "том хэмжээний хөгжмийн зохиолын дунд нэмэгдэн орж тоглогддог бага хэмжээний аялгуу." }, { "language": "베트남어", "lemma": "khúc nhạc đệm", "definition": "Khúc nhạc khí với quy mô nhỏ được tấu chen vào giữa khúc nhạc quy mô lớn." }, { "language": "타이어", "lemma": "เพลงคั่น", "definition": "ดนตรีบรรเลงสั้น ๆ ที่บรรเลงแทรกบทเพลงยาว ๆ" }, { "language": "인도네시아어", "lemma": "intro, intermeso, musik selingan", "definition": "musik instrumental berskala kecil yang disisipkan dan dimainkan di tengah-tengah musik berskala besar" }, { "language": "러시아어", "lemma": "интерлюдия", "definition": "Небольшое музыкальное произведение на инструменте, исполняемое между основными частями длинного музыкального произведения." }, { "language": "영어", "lemma": "intermezzo", "definition": "A small-scaled, instrumental piece of music, inserted in a large-scaled musical work." }, { "language": "일본어", "lemma": "かんそうきょく【間奏曲】 ", "definition": " 規模が大きい楽曲の途中挿入される小さい規模の楽曲。" }, { "language": "프랑스어", "lemma": "interlude", "definition": "Courte pièce musicale jouée entre deux morceaux de musique plus considérables." }, { "language": "스페인어", "lemma": "interludio", "definition": "Breve composición instrumental que se ejecuta en el intermedio de una sinfonía a gran escala." }, { "language": "아랍어", "lemma": "(لا يوجد كلمة مرادفة)", "definition": "موسيقى ملحّنة للعزف على الآلات الموسيقية بحجم صغير التي تعزف عليها في متوسط من القطعة الموسيقية بحجم كبير " }, { "language": "중국어", "lemma": "间奏曲，插曲", "definition": "在规模较大的乐曲中间插入演奏的小规模的器乐曲。" }] }], "_id": "14157", "_rev": "1-a96a5b3544c1409787f9443dd2cc5bf3" }, { "homonym_number": "1", "lexicalUnit": "단어", "partOfSpeech": "명사", "origin": "看做", "vocabularyLevel": "고급", "semanticCategory": "인간 > 인지 행위", "Lemma": { "writtenForm": "간주" }, "WordForm": [{ "type": "발음", "pronunciation": "간주", "sound": "https://dicmedia.korean.go.kr/multimedia/sound_file/giyeok_2005/ganju.wav" }], "RelatedForm": [{ "type": "파생어", "_id": "14158", "writtenForm": "간주되다" }, { "type": "파생어", "_id": "14159", "writtenForm": "간주하다" }], "Sense": [{ "_id": "1", "definition": "무엇이 어떠하다고 생각되거나 여겨짐.", "SenseExample": [{ "_id": "1", "type": "구", "example_1": "간주가 되다." }, { "_id": "2", "type": "구", "example_1": "간주를 하다." }, { "_id": "3", "type": "문장", "example_1": "경찰은 파업을 불법 행위로 간주, 노동자들을 모두 구속할 방침이었다." }, { "_id": "4", "type": "문장", "example_1": "시험 시간에는 커닝뿐만 아니라 부정행위로 간주가 되는 모든 행위가 금지된다." }, { "_id": "5", "type": "대화", "example_1": "그 사람이 내 전화를 안 받는 건 나를 일부러 피하는 거라고 여겨도 되겠지?", "example_2": "그렇게 단정적으로 간주를 할 게 아니라 자세한 사정부터 알아보자." }], "Equivalent": [{ "language": "몽골어", "lemma": "гэж үзэх, -д тооцох", "definition": "ямар нэг зүйлийг тийм хэмээн бодох, тооцох." }, { "language": "베트남어", "lemma": "(sự) xem như, coi như", "definition": "Việc điều gì đó được xem hay nghĩ là thế nào đó." }, { "language": "타이어", "lemma": "การนับเป็น, การนับว่า, การถือว่า, ถือว่าเป็น, ยึดถือว่าเป็น", "definition": "การที่สิ่งใดๆถูกคิดหรือยึดมั่นว่าเป็นอย่างไร" }, { "language": "인도네시아어", "lemma": "anggapan, asumsi ", "definition": "sesuatu yang dianggap atau diinterpretasikan " }, { "language": "러시아어", "lemma": "объект рассмотрения; рассмотрение", "definition": "Рассматривать с какой-либо точки зрения." }, { "language": "영어", "lemma": "regard; consideration; count", "definition": "The state of something being thought or considered to have a certain trait." }, { "language": "일본어", "lemma": "みなすこと【見做すこと】。みたてること【見立てること】。おしはかること【推し量ること】", "definition": "…と思うこと。…と判断すること。" }, { "language": "프랑스어", "lemma": "considération", "definition": "Pensée ou jugement sur l'état de quelque chose." }, { "language": "스페인어", "lemma": "consideración", "definition": "Reflexión o juicio que se tiene sobre algo." }, { "language": "아랍어", "lemma": "عَدٌّ", "definition": "أن يعتتر أو يعد شيئّ شيئاً " }, { "language": "중국어", "lemma": "看做", "definition": "想或认为某事怎么样。" }] }], "_id": "14057", "_rev": "1-86e711035e5b47ed962e585baea993fd" }]

const DisplayCardScreen = (props) => {

    const data1 = props.navigation.getParam('data', 'nothing sent');
    const [data, setData] = useState(data1?.doc)
    const [editMode, setEditMode] = useState(false);
    const [items, setItems] = useState([]);
    const [leftItems, setLeftItems] = useState(data?.cards)
    const [newSet, setNewSet] = useState([])
    const [isOverlayActive, setOverlayActive] = useState(false);
    const [myData, setMyData] = useState([]);
    const [catDetails, setCatDetails] = useState({})
    const [category, setCategory] = useState('');
    const [myCardData, setMyCardData] = useState(data?.cards);
    const { t, i18n } = useTranslation();



    // console.log('myCardData : ',myCardData)
    //Function to check if the item is checked or not
    const isChecked = (itemId) => {
        try {
            const isThere = items.includes(itemId);
            return isThere;
        } catch (e) {
            console.log(e)
        }
    };


    //Function to toggle the item(check and uncheck)
    const toggleChecked = (itemId, item) => {
        const x = [itemId, ...items]
        const y = [item, ...newSet]
        if (isChecked(itemId)) {
            setItems(items.filter((id) => id !== itemId))
            setNewSet(newSet.filter((item, index) => index !== itemId))
        } else {
            setItems(x)
            setNewSet(y)
        }
    }


    //function handle the delete fash card items
    const handelDelete = () => {
        let x = leftItems.filter(i => !newSet.some(j => i.koreanHeadWord === j.koreanHeadWord))


        // console.log('all : ', leftItems)
        // console.log('selected : ', newSet)
        // console.log('will keep : ', data)
        // console.log('will keep : ', x)

        if (newSet.length != 0) {
            const newObj = Object.assign({}, data, { "cards": x })
            console.log(JSON.stringify(newObj))
            localDB.put(newObj).then((response) => {
                console.log('responcen : ', response)
                localDB.get(newObj["_id"]).then(function (doc) {
                    setData(doc)
                    setMyCardData(doc.cards)
                    setEditMode(!editMode)
                }).catch((e) => console.log(e))
            }).catch((e) => console.log(e))
        } else {
            Toast.show(`${t("SelectItemToDeleteText")}`, Toast.SHORT)
        }

    }

    //function to fetch the data
    async function fetchData() {
        localDB.get(data1?.doc["_id"]).then(function (doc) {
            console.log(doc)
            setData(doc)
            setMyCardData(doc.cards)
        }).catch((e) => console.log(e))
    }


    //Function responceble to drag items
    const moveHandel = () => {
        if (category) {
            const x = Object.assign({}, catDetails?.doc, { "cards": [...catDetails?.doc?.cards, ...newSet] })
            console.log('final : ', JSON.stringify(x))
            localDB.put(x).then((response) => {
                console.log('responcen : ', response)
                localDB.get(x["_id"]).then(function (doc) {
                    console.log('updated card list data : ', JSON.stringify(doc))
                    handelDelete()
                    setOverlayActive(!isOverlayActive)
                }).catch((e) => console.log(e))
            }).catch((e) => console.log(e))

        } else {
            Toast.show(`${t("SelectCategoryToMove")}`, Toast.SHORT)
        }
    }

    const renderDef = (data) => {
        return data.map((item, i) => {
              return (
                    <Text style={[styles.TextStyle,{fontSize:12}]}>{item.value && `${i+1} ${item.value}`}</Text>
              );
          });
    }
const renderItem = ({ item, index, move, moveEnd, isActive }) => {
    console.log(item)
    return (
    <TouchableOpacity
    onLongPress={move}
    onPressOut={moveEnd}
    onPress={() => { !editMode && props.navigation.navigate(NAVIGATION_FLASH_CARD_DATA_SCREEN_PATH, { item }) }}>
        <View
            style={{
                backgroundColor: 'white',
                paddingVertical: 4,
                paddingRight: 8,
                paddingLeft: editMode ? 48 : 8,
                paddingHorizontal: 8,
                marginVertical: 6,
                marginHorizontal: 8,
                borderRadius: 10
            }}>
            {
                editMode &&
                <View style={{ position: 'absolute', left: -4, zIndex: 4 }}>
                    <CheckBox
                        checkedColor={Constants.appColors.PRIMARY_COLOR}
                        containerStyle={{ backgroundColor: Constants.appColors.TRANSPARENT, zIndex: 4 }}
                        size={20}
                        title=""
                        checkedIcon="check-square"
                        uncheckedIcon="square"
                        checked={isChecked(index)}
                        onPress={() => toggleChecked(index, item)}
                    />
                </View>
            }

            <View style={{ position: 'absolute', zIndex: 3, right: editMode ? 42 : 16, top: 8 }}>
                <TouchableOpacity onPress={() => {
                    try {
                        Tts.setDefaultLanguage('ko-KR');
                        Tts.speak(item?.speech)
                    } catch (e) {
                        console.log(`cannot play the sound file`, e)
                        Toast.show(`${t("NoAudioFileFoundText")}`, Toast.SHORT);
                    }
                }}>
                    <Image source={require('../../assets/logo/audio-black-icon.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.TextStyle, { marginVertical: 4 }]}>
                {item?.koreanHeadWord}
                {item?.englishHeadWord && `(${item?.englishHeadWord})`}
            </Text>
            <Text style={[styles.TextStyle, { color: Constants.appColors.GRAY, fontSize: 12, paddingVertical: 4 }]}>{item?.speech}</Text>
            {
                item.definition.length > 0 && renderDef(item.definition)
            }
            {
                editMode &&
                <View style={{ marginLeft: 12, position: 'absolute', right: 8, top: 16 }}>
                    <MIcons name="view-headline" size={22} color={Constants.appColors.PRIMARY_COLOR} />
                </View>
            }
        </View>
    </TouchableOpacity>

)}


    //fetch falshcard data using sorting by category name
    async function fetchCatData() {
        localDB.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                    return console.log(err);
                }
                const y = response.rows.filter(item => item.id != data["_id"])
                setMyData(y);
                return y;
            },
        );
    }

    useEffect(() => {
        fetchCatData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents onDidFocus={(payload) => { fetchData() }} />
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <View style={styles.container}>
                    <View style={{ padding: 6, alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', left: 0 }}>
                        {
                            editMode ?
                                <TouchableOpacity onPress={() => { setEditMode(!editMode); setItems([]) }}>
                                    <Text style={{ fontSize: 20, color: 'white' }}>{`${t("CancelText")}`}</Text>
                                </TouchableOpacity>
                                :

                                <TouchableOpacity onPress={() => { setEditMode(!editMode); props.navigation.dispatch(NavigationActions.back()) }}>
                                    <Text style={{ fontSize: 20, color: 'white' }}>{`${t("BackText")}`}</Text>
                                </TouchableOpacity>}
                    </View>
                    <Text style={[styles.textStyle2]}>{data?.name}</Text>
                    <View style={{ padding: 6, alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', right: 0 }}>
                        {
                            !editMode ? <>

                                <TouchableOpacity onPress={() => props.navigation.navigate(NAVIGATION_NEW_CARD_SCREEN_PATH, { path: data1 })}>
                                    <View style={{ marginHorizontal: 12 }}>
                                        <MIcons name="insert-drive-file" size={23} color={Constants.appColors.WHITE} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    console.log('edit press')
                                    setEditMode(!editMode)
                                }}>
                                    <MIcons name="edit" size={23} color={Constants.appColors.WHITE} />
                                </TouchableOpacity></>
                                :
                                <View style={{ width: 100, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={handelDelete}>
                                        <MIcons name="delete" size={23} color={Constants.appColors.WHITE} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        console.log('Move')
                                        setOverlayActive(!isOverlayActive)
                                        //setEditMode(!editMode)
                                    }}>
                                        <FIcons name="share" size={24} color={Constants.appColors.WHITE} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        console.log('save press')
                                        setItems([])
                                        setEditMode(!editMode)
                                    }}>
                                        <MIcons name="check" size={24} color={Constants.appColors.WHITE} />
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>
                </View>
                {newSet.length > 0 &&
                    <CustomPopup
                        visible={isOverlayActive}
                        onRequestClose={() => setOverlayActive(!isOverlayActive)}
                        transparent={true}
                        animationType='fade'
                        modalContainerStyle={{
                            height: Sizes.WINDOW_HEIGHT, backgroundColor: 'white',
                            width: '100%',
                            maxHeight: Sizes.WINDOW_HEIGHT * .5
                        }}
                    >
                        <View style={{ paddingHorizontal: 12, paddingTop: 8, flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 16, marginBottom: 12 }}>{`${t("SelectCategoryText")}`}</Text>
                                <TouchableOpacity onPress={() => setOverlayActive(!isOverlayActive)}>
                                    <Icon name='closecircle' size={24} color={Constants.appColors.PRIMARY_COLOR} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                keyboardShouldPersistTaps={'handled'}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => {
                                        setCategory(item?.doc?.name);
                                        setCatDetails(item);
                                    }}>
                                        <View style={{ borderWidth: .5, marginVertical: 4, borderRadius: 10, borderColor: Constants.appColors.LIGHTGRAY }}>
                                            <Text style={{ fontSize: 20, paddingLeft: 4, paddingVertical: 8, color: item?.doc?.name == category ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.BLACK }}>{item?.doc?.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                data={myData}
                                numColumns={1}
                                showsVerticalScrollIndicator={false}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: Platform.OS == 'ios' ? 20 : 12 }}>
                                <CustomButton
                                    style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                                    title={`${t("MoveText")}`}
                                    titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                                    onPress={moveHandel}
                                />
                            </View>

                        </View>
                    </CustomPopup>}
            </View>
            <View style={{ flex: 1 }}>
                {
                    editMode ? 
                    <DraggableFlatList
                    data={data?.cards}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `draggable-item-${item.englishHeadWord}`}
                            scrollPercent={5}
                            onMoveEnd={({ data }) => setMyCardData(data)}
                        />
                        :
                        <FlatList
                        keyboardShouldPersistTaps={'handled'}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.englishHeadWord}`}
                        data={myCardData}
                        numColumns={1}
                        showsVerticalScrollIndicator={false}
                    />
                }

                {
                    data?.cards.length == 0 && <Text style={{ position: 'absolute', top: Sizes.WINDOW_HEIGHT * .35 - 32, left: Sizes.WINDOW_WIDTH / 2 - 48 }}>{`${t("NoCardFoundText")}`}</Text>
                }
            </View>
        </View>
    )
}

DisplayCardScreen.navigationOptions = {
    headerShown: false,
}


export default DisplayCardScreen;
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
    container: {
        backgroundColor: Constants.appColors.PRIMARY_COLOR,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        flexDirection: 'row'
    },
    textStyle2: {
        color: Constants.appColors.WHITE,
        fontSize: 20,
        marginLeft: 8,
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    addressContainer: { justifyContent: 'space-between', flexDirection: 'row', marginBottom: 6, paddingRight: 8 }
});