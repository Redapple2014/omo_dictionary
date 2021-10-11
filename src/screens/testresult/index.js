import React, { useState, useRef, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
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
import CustomBar from '../../components/progressbar'
var hangulRomanization = require('hangul-romanization');

PouchDB.plugin(require('pouchdb-find'));



const data = { "annotation": null, "homonym_number": 0, "id": 17866, "idiomInfo": "[]", "idiomsDef": "[]", "idiomsSense": "[]", "idiomsSenseSample": "[]", "lemma": "여보세요", "lexicalUnit": "단어", "origin": null, "partofspeech": "감탄사", "relatedForm": "[]", "sense": "[{\"sense_id\":2,\"en_lm\":\"hello; hi; hey there\",\"en_def\":\"An exclamation used to call another person who is nearby.\"},{\"sense_id\":1,\"en_lm\":\"hello\",\"en_def\":\"An exclamation used to call the other person on the phone.\"}]", "senseExample": "[{\"sense_id\":2,\"type\":\"문장\",\"example_1\":\"여보세요, 아무도 안 계세요?\",\"example_2\":null},{\"sense_id\":2,\"type\":\"문장\",\"example_1\":\"여보세요, 뭐 좀 여쭤 볼게요.\",\"example_2\":null},{\"sense_id\":2,\"type\":\"문장\",\"example_1\":\"여보세요, 여기 물 한 잔만 주세요.\",\"example_2\":null},{\"sense_id\":2,\"type\":\"대화\",\"example_1\":\"여보세요, 서울 가려면 여기서 버스 타면 되나요?\",\"example_2\":\"아니요, 건너편 가서 타셔야 돼요.\"},{\"sense_id\":1,\"type\":\"문장\",\"example_1\":\"여보세요, 제 말 들리세요?\",\"example_2\":null},{\"sense_id\":1,\"type\":\"문장\",\"example_1\":\"여보세요, 전화 바꿨습니다.\",\"example_2\":null},{\"sense_id\":1,\"type\":\"문장\",\"example_1\":\"여보세요, 거기 이 선생님 계세요?\",\"example_2\":null},{\"sense_id\":1,\"type\":\"대화\",\"example_1\":\"여보세요, 거기 김 사장님 댁입니까?\",\"example_2\":\"네, 맞는데 누구신가요?\"}]", "translate": "[{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":1,\"example_1\":\"Hello, is anyone here?\",\"example_2\":null},{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":2,\"example_1\":\"Hello, let me ask you something.\",\"example_2\":null},{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":3,\"example_1\":\"Hello, just a glass of water, please.\",\"example_2\":null},{\"sense_id\":2,\"lemma\":\"여보세요\",\"example_id\":4,\"example_1\":\"Hello, can I take a bus from here to Seoul?\",\"example_2\":\"No, you have to go across the street and get on.\"},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":1,\"example_1\":\"Hello, can you hear me?\",\"example_2\":null},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":2,\"example_1\":\"Hello, I changed my phone.\",\"example_2\":null},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":3,\"example_1\":\"Hello, is this teacher there?\",\"example_2\":null},{\"sense_id\":1,\"lemma\":\"여보세요\",\"example_id\":4,\"example_1\":\"Hello, is that Mr. Kim's house?\",\"example_2\":\"Yes, that's right. Who are you?\"}]", "vocabularyLevel": "초급", "wordForm": "[]" }

//db instance with db_name
var localDB = new PouchDB('flashcard');

const TestResultScreen = (props) => {

  const { t, i18n } = useTranslation();




  //go back handeller
  const goBack = () => props.navigation.dispatch(NavigationActions.back())

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
        <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
        <CustomHeader title="Test Results" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal:12,paddingVertical:8,borderRadius: 10, marginTop: 12, marginHorizontal: 12, backgroundColor: Constants.appColors.WHITE, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row',borderBottomColor:Constants.appColors.LIGHTGRAY,borderBottomWidth:.5,paddingBottom:8 }}>
            <Text style={styles.headerTextStyle}>Total Cards Reviewed: </Text>
            <Text style={styles.headerTextStyle}>100</Text>
          </View>
          <Text style={{textAlign:'center',paddingVertical:12,fontWeight:'bold',fontSize:16,color:Constants.appColors.BLACK}}>Results Breakdown</Text>
          <View style={{justifyContent:'center',paddingHorizontal:12}}>
          <View style={{flexDirection:'row'}}>
          <View style={{width:110}}>
            <Text style={{marginRight:12,color:Constants.appColors.DARKGRAY,fontWeight:'bold'}}>{`1. Perfect`}</Text>
            </View>
        <CustomBar style={{height:20,width:150}} color={`#54E346`} complete={60}/>
        </View>
        <View style={{flexDirection:'row'}}>
        <View style={{width:110}}>
            <Text style={{marginRight:12,color:Constants.appColors.DARKGRAY,fontWeight:'bold'}}>{`2. Recalled`}</Text>
        </View>
        <CustomBar style={{height:20,width:150}} color={`#9EDE73`} complete={20}/>
        </View>
        <View style={{flexDirection:'row'}}>
          <View style={{width:110}}>
            <Text style={{marginRight:12,color:Constants.appColors.DARKGRAY,fontWeight:'bold'}}>{`3. Barely`}</Text>
            </View>
        <CustomBar style={{height:20,width:150}} color={`#FFB344`} complete={14}/>
        </View>
        <View style={{flexDirection:'row'}}>
        <View style={{width:110}}>
            <Text style={{marginRight:12,color:Constants.appColors.DARKGRAY,fontWeight:'bold'}}>{`4. Incorrect`}</Text>
            </View>
        <CustomBar style={{height:20,width:150}} color={`#DF2E2E`} complete={30} />
        </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
          <CustomButton
            style={{ height: 40, width: Sizes.WINDOW_WIDTH - 24, backgroundColor: Constants.appColors.WHITE, borderWidth: 1, borderColor: Constants.appColors.LIGHTGRAY, borderRadius: 10 }}
            title={`Complete Session`}
            titleStyle={{ fontSize: 15, color: `#54E346`, fontWeight: 'bold' }}
            onPress={() => { }}
          />
        </View>
      </View>
    </View>
  )
};

TestResultScreen.navigationOptions = {
  headerShown: false,
};

export default TestResultScreen;

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
  },
  headerTextStyle: { fontWeight: 'bold', color: Constants.appColors.BLACK, fontSize: 17 }
});