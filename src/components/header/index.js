import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Constants from '../../utills/Constants';
import MIcons from 'react-native-vector-icons/MaterialIcons'
const CustomHeader = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{props.title}</Text>
    </View>
  )
}

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.appColors.PRIMARY_COLOR,
    padding:6
  },
  textStyle: {
    color: Constants.appColors.WHITE,
    fontSize: 20,
    marginLeft: 8,
    marginTop:4,
    textAlign:'center'
  },
  addressContainer:{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 6, paddingRight: 8 }
})