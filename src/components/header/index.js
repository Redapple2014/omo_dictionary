import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import Constants from '../../utills/Constants';
import Icon from "react-native-vector-icons/Ionicons";
import Sizes from '../../utills/Size';

const CustomHeader = (props) => {
  return (
    <View style={styles.container}>
      {
        props.leftIcon ?
          <View style={{ left: 8, top: 12, position: 'absolute' }}>
            <TouchableOpacity style={{ width: 70 }} onPress={props.onPressleftIcon}>
              <Text style={{ fontSize: 18, color: 'white' }}>{props.leftIcon}</Text>
            </TouchableOpacity></View> : <></>
      }
      <Text style={styles.textStyle}>{props.title}</Text>
      {
        props.rightIcon ?
          <View style={{ right: -16, top: 10, position: 'absolute' }}>
            <TouchableOpacity style={{ width: 70 }} onPress={props.onPressrightIcon}>
              <Text style={{ fontSize: 18, color: 'white' }}>{props.rightIcon}</Text>
            </TouchableOpacity></View> : <></>
      }
    </View>
  )
}

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.appColors.PRIMARY_COLOR,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',

  },
  textStyle: {
    color: Constants.appColors.WHITE,
    fontSize: 20,
    marginLeft: 8,
    marginTop: 4,
    textAlign: 'center'
  },
  addressContainer: { justifyContent: 'space-between', flexDirection: 'row', marginBottom: 6, paddingRight: 8 }
})