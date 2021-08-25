import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, Image, StatusBar, Keyboard, FlatList, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomSearchBar from '../../components/searchbar/CustomSearchBar';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from "react-native-status-bar-height";
import PouchDB from 'pouchdb-react-native';
import d1 from '../../resources/dictionary/dict_1_small.json'
import d2 from '../../resources/dictionary/dict_2_small.json';
import axios from 'axios';

//db instance with db_name
var localDB = new PouchDB('dev');

//document list
var toinsert = [d1,d2];

//lopping of all json
toinsert.forEach(function (json) {

  //iterate each json and get each document

  // json.forEach(function (element,index){
  //   //console.log(index,'***************',JSON.stringify(element))
  //  // insert(element)
  // })




  localDB.allDocs().then(entries => {
    if(entries.rows.length==0){
      insert(json)
    }
    else{
      return
    }
  });
})


//insert function
async function insert(json) {
  //bulk data insert
  await localDB.bulkDocs(json).then(function (result) {
    console.log('Row inserted Successfully');
  }).catch(function (err) {
    console.log('Unable to insert into DB. Error: ' + err.name + ' - ' + err.message);
  });

  //single document insert
  // try {
  //   var response = await localDB.put(json);
  // } catch (err) {
  //   console.log(err);
  // }
}

const HomeScreen = () => {

  const MAX_NUMBER_OF_RECENT_DATA = 3
  const [searchText, setSearchText] = useState('')
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [reacientlySearchedData, setReacientlySearchedData] = useState([]);
  const [reacientlySearchedStatus, setReacientlySearchedStatus] = useState('');

  const inputEl = useRef(null)


  //delete recently searched data
  const removeItemValue = async function (key) {
    try {
      await AsyncStorage.removeItem(key);
      setReacientlySearchedData([])
      console.log('cleared')
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  //retrive recently searched data
  function getDatafromStorage() {
    AsyncStorage.getItem('search_data')
      .then(req => {
        if (!req) {
          setReacientlySearchedStatus('No recent search data avalible');
          //console.log('no data found on recent search')
          return
        }
        setReacientlySearchedData(JSON.parse(req))
        //console.log(JSON.parse(req))
      })
      .catch(error => console.log('error!'));
  }

  //search the entered data
  function onSearchSubmit() {
    if (searchText) {
      if (reacientlySearchedData.length > MAX_NUMBER_OF_RECENT_DATA) {
        reacientlySearchedData.splice(MAX_NUMBER_OF_RECENT_DATA, 1);
      }
      AsyncStorage.setItem('search_data', JSON.stringify([searchText, ...reacientlySearchedData]))
      getDatafromStorage()
      setSearchText(searchText)
    }
    else {
      console.log('search text input is empty')
      setSearchText('')
    }
  }

  useEffect(() => {

    //destroy db
    // try{
    //   localDB.destroy()
    // }catch(e){
    //   console.log(e)
    // }
    

    getDatafromStorage();
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();

    };
  }, []);


  //fetch data by id
async function fetchDataById(){
  const id = '72336'
  localDB.get(id).then(function (doc) {
   console.log(`data : ${id} `,JSON.stringify(doc))
  }).catch(function (err) {
    console.log(err);
  });

// get all documents
  // localDB.allDocs().then(function (result) {
  //   console.log(JSON.stringify('************ ',result))
  //   }).catch(function (err) {
  //     console.log(err);
  //   });
}


useEffect(()=>{

   fetchDataById()
},[])


  //render recently rearched data
  function renderRecentSearchData() {
    return (
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSearchText(item)
            }>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', height: 45, borderBottomWidth: .5, borderColor: Constants.appColors.LIGHTGRAY, alignItems: 'center', paddingHorizontal: 8, borderWidth: .5 }}>
              <Text style={{ fontSize: 16, color: Constants.appColors.GRAY, paddingLeft: 12 }}>{item}</Text>
            </View>
          </TouchableOpacity>

        )}
        keyExtractor={(item, index) => index.toString()}
        data={reacientlySearchedData}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    )
  }


  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
        <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
      </View>
      <View style={{ backgroundColor: 'red',justifyContent:'center', height: isKeyboardVisible || searchText.length > 0 ? Sizes.WINDOW_HEIGHT * .1 : Sizes.WINDOW_HEIGHT * 0.38, backgroundColor: Constants.appColors.PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center' }}>
        {isKeyboardVisible || searchText.length > 0 ? <></> : <View style={{marginBottom:Sizes.WINDOW_WIDTH*.18}}><Image source={require('../../assets/logo/omo-logo_1.png')} style={{ width: 300, height: 100, resizeMode: 'contain' }} /></View>}
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <CustomSearchBar
          ref={inputEl}
          lightTheme
          value={searchText}
          onChangeText={value => setSearchText(value)}
          inputContainerStyle={{ backgroundColor: Constants.appColors.WHITE, height: 48, borderRadius: 10, top: -1 }}
          containerStyle={{ padding: 0, margin: 0, borderRadius: 18, height: 45, width: '95%', top: isKeyboardVisible ? Sizes.WINDOW_HEIGHT * 0.01 : searchText.length > 0 ? Sizes.WINDOW_HEIGHT * 0.01 : Sizes.WINDOW_HEIGHT * 0.3, position: 'absolute', alignSelf: 'center' }}
          inputStyle={{ color: 'black' }}
          placeholder='Search in Korean or English'
          onSubmitEditing={onSearchSubmit}
        />
      </TouchableWithoutFeedback>
      {
        isKeyboardVisible && reacientlySearchedData.length != 0 ? <>
          <View style={{ marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
            <Text style={{ fontWeight: 'bold', }}>Recently Searched</Text>
            <TouchableOpacity onPress={() =>
              removeItemValue('search_data')
            }>
              <Text style={{ fontWeight: '400', textDecorationLine: 'underline' }}>Clear History</Text>
            </TouchableOpacity>
          </View>
          {renderRecentSearchData()}
        </> : reacientlySearchedData.length == 0 && isKeyboardVisible ? <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ paddingTop: 16 }}>{reacientlySearchedStatus}</Text></View> : <></>
      }
    </View>
  )
}

HomeScreen.navigationOptions = {
  headerShown: false
}

export default HomeScreen;
