import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Constants from '../../utills/Constants';
import { Icon } from 'react-native-elements';


const CustomBar = (props) => {

  const title = props.title;

  const widthCal = (com) => {
    return com*1.1
  }

  return (
    props.complete<=100 && <View style={{flexDirection:'row',marginVertical:4,justifyContent:'center',marginRight:32}}>
          <View style={[props.style, {  flexDirection: 'row',width: widthCal(props.complete) ,maxWidth:110, backgroundColor:props.color,borderRadius:7 }]}/>
         { props.complete && <Text style={{marginLeft:12,color:Constants.appColors.DARKGRAY}}>{`${props.complete} / ${props.complete}%`}</Text>}
       </View>
  );
}

const styles = StyleSheet.create({
  iconStyle:
  {
    marginRight: 30,
  }
});


export default CustomBar;