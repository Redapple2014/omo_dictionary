import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import Constants from '../../utills/Constants';
import Icon from "react-native-vector-icons/Ionicons";
import EIcons from "react-native-vector-icons/Entypo";

const SearchHeader = (props) => {
  return (
    <View style={styles.container}>
      {
        props.leftIcon ?

          <View style={{ width: 100, left: -4 , top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={props.onPressleftIcon}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name='chevron-back-sharp' size={23} color={Constants.appColors.WHITE} />
                <Text style={{ fontSize: 18, color: 'white' }}>{props.leftIcon}</Text>
              </View>
            </TouchableOpacity>
          </View>
          : <></>
      }
      <Text style={styles.textStyle}>{props.title}</Text>
      { props.show && 
        <View style={{ padding: 6, alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', flex: props.showBookmark ? .45:.37 }}>
          {props.showBookmark && <TouchableOpacity onPress={props.bookMarkPress}>
            <EIcons name="plus" size={23} color={Constants.appColors.WHITE} />
          </TouchableOpacity>}
          <TouchableOpacity onPress={props.onSoundPlay}>
            <Image source={require('../../assets/logo/audio-white-icon.png')} style={styles.imageStyle}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.upArrowFunction} disabled={props.upArrowStyle ? false:true}>
            <EIcons name="arrow-bold-up" size={23} color={props.upArrowStyle ? Constants.appColors.WHITE : `rgba(245, 243, 244, 0.3)`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.downArrowFunction} disabled={props.downArrowStyle ? false:true}>
            <EIcons name="arrow-bold-down" size={23} color={props.downArrowStyle ? Constants.appColors.WHITE : `rgba(245, 243, 244, 0.3)`} />
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.appColors.PRIMARY_COLOR,
    padding: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    flexDirection: 'row'
  },
  textStyle: {
    color: Constants.appColors.WHITE,
    fontSize: 20,
    marginLeft: 8,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageStyle:{
    width:24,
    height:24,
    resizeMode:'contain'
  },
  addressContainer: { justifyContent: 'space-between', flexDirection: 'row', marginBottom: 6, paddingRight: 8 }
})