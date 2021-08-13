import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Constants from '../../utills/Constants';
import { Icon } from 'react-native-elements';


const CustomButton = (props) => {

  const title = props.title;

  return (
    <TouchableOpacity onPress={props.onPress} disabled={props.isButtonActive}>
      <View style={[props.style, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
        {
          props.iconTitle && <Icon name={props.iconTitle} type={props.iconType} size={22} color={props.iconStyle.color} style={[styles.iconStyle,props.iconStyle]} /> 
        }
        <Text style={[{ textAlign: 'center',color:Constants.appColors.WHITE },props.titleStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconStyle:
  {
    marginRight: 30,
  }
});


export default CustomButton;