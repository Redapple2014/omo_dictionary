import React from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet } from 'react-native';
import Constants from '../../utills/Constants';

const CustomSearchBar = React.forwardRef((props, ref) => (
  <SearchBar
    ref={ref}
    lightTheme={props.lightTheme}
    value={props.value}
    onChangeText={props.onChangeText}
    inputContainerStyle={[props.inputContainerStyle, styles.inputContainerStyle]}
    containerStyle={[styles.containerStyle, props.containerStyle]}
    inputStyle={[styles.inputStyle, props.inputStyle]}
    placeholder={props.placeholder}
    onSubmitEditing={props.onSubmitEditing}
    showCancel={props.showCancel}
    onClear={props.onClear}
  />
));

export default CustomSearchBar;

const styles = StyleSheet.create({
  inputContainerStyle: {
    backgroundColor: Constants.appColors.WHITE
  },
  containerStyle: {
    padding: 0, margin: 0, borderRadius: 5
  },
  inputStyle: {
    color: 'black'
  },
});