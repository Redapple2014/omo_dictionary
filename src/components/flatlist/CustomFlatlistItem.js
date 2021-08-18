import React, { Component, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import Constants from '_utils/Constants';
import Sizes from '_utils/Size';
import CustomButton from "_components/button/CustomButton";


const CustomFlatlistItem = (props) => {
  const [data, setData] = useState(props.eachData)
  return (
    <>
      {
        props.type == 'list' ?
          <TouchableOpacity onPress={props.onPress}>
            <View style={styles.container}>
              <Image source={{ uri: data.img }} style={styles.listImageStyle} />
              <View style={{ flexDirection: 'column', margin: 8, flex: 1 }}>
                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontWeight: 'bold' }}>{data.resturentName}</Text>
                <Text style={[styles.textColor, { marginVertical: 2 }]}>{data.type}</Text>
                <Text style={styles.textColor}>{data.loc}</Text>
                <Text style={styles.textColor}>{`Cost for Two : ₹ ${data.costForTwo}`}</Text>
                <View style={styles.hrDiv}></View>
                <View style={styles.bottomContainer}>
                  <View style={{ justifyContent: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AIcon name='star' size={12} color={Constants.appColors.BLUE} />
                      <Text style={{ color: Constants.appColors.BLUE }}>{data.rate}</Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'flex-end' }}>
                    <Text style={styles.textColor}>{`Deliver in ${data.delv} min. `}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          :
          props.type == 'product_item' ?

            <View style={{ flexDirection: 'column', justifyContent: 'center', width: Sizes.WINDOW_WIDTH / 2, paddingBottom: 24 }}>
              <View style={{ flex: 1, ustifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: data.img }} style={styles.recomProductImageStyle} />
              </View>
              <Text style={{ paddingLeft: 16, color: Constants.appColors.GRAY, fontSize: 10 }}>{data.category}</Text>
              <Text style={{ paddingLeft: 16, paddingBottom: 8 }}>{data.dishName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                {data.dataVal ? <></> : <>
                  <Text style={{ color: 'blue', fontSize: 15 }}>{`₹ ${data.price}`}</Text>
                  <CustomButton
                    style={{ height: 25, width: 64, borderWidth: .5, borderColor: Constants.appColors.LIGHTGRAY, backgroundColor: Constants.appColors.TRANSPARENT }}
                    title=' + Add '
                    titleStyle={{ color: Constants.appColors.MENU_COLOR }}
                    onPress={props.onPress}
                  /></>
                }
              </View>
            </View>
            :
            <TouchableOpacity onPress={props.onPress}>
              <View style={styles.offerImgContainer}>
                <Image source={{ uri: data.img }} style={styles.offerImgStyle} />
              </View>
            </TouchableOpacity>
      }
    </>

  );
}


export default CustomFlatlistItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 4
  },
  offerImgContainer: {
    flexDirection: 'row',
    width: Sizes.WINDOW_WIDTH / 2,
    height: Sizes.WINDOW_WIDTH / 2,
    borderRadius: 10,
    paddingHorizontal: 8
  },
  offerImgStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
    borderWidth: 0
  },
  textColor: {
    color: Constants.appColors.GRAY
  },
  listImageStyle: {
    width: 100,
    height: 100,
    margin: 8,
    resizeMode: 'contain',
    borderWidth: 0
  },
  hrDiv: {
    borderWidth: .5,
    borderColor: Constants.appColors.LIGHTGRAY,
    marginVertical: 8
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  recomProductImageStyle: {
    width: Sizes.WINDOW_WIDTH / 2 - 32,
    height: 100,
    margin: 8,
    resizeMode: 'contain',
    borderWidth: 0
  }
});