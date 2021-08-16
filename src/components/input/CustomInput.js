import React,{ useState } from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import Constants from '../../utills/Constants';

const CustomInput = (props) => {
  return (
    <Input
      label={props.label}
      labelStyle={props.labelStyle}
      inputStyle={props.inputStyle}
      placeholder={props.placeholder}
      autoCapitalize={props.autoCapitalize}
      returnKeyType={props.returnKeyType}
      autoCorrect={props.autoCorrect}
      inputContainerStyle={[styles.textInputContainerStyle,props.inputContainerStyle]}
      keyboardType={props.keyboardType}
      leftIconContainerStyle={styles.leftIconContainerStyle}
      placeholderTextColor={props.placeholderTextColor}
      placeholderFontSize={props.placeholderFontSize}
      containerStyle={[styles.containerStyle,props.containerStyle]}
      value={props.value}
      maxLength={props.maxLength}
      secureTextEntry = {props.secureTextEntry}
      onChangeText={props.onChangeText}
      rightIcon = {props.rightIcon}
      errorMessage = {props.errorMessage}
      placeholderStyle={props.placeholderStyle}
      errorStyle = {props.errorStyle}
    />
  );
}

export default CustomInput;

const styles = StyleSheet.create({
  textInputContainerStyle: {
    margin: 4,
    fontSize: 12,
borderWidth:0,
borderBottomColor:'white'
  },
  leftIconContainerStyle: {
    marginRight: 16
  },
  containerStyle: {
    height: 50
  },
});

