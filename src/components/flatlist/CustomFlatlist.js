import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import CustomFlatlistItem from './CustomFlatlistItem';
import Constants from '../../utills/Constants';
import Size from '../../utills/Size';
import AntIcon from 'react-native-vector-icons/Fontisto';

const CustomFlatlist = (props) => {

  const flatlistType = props.type;


  renderItemList = (dataSet) => {
    return (
      <CustomFlatlistItem
        viewContainerStyle={{ width: Size.WINDOW_WIDTH / 2 }}
        itemContainerStyle={{}}
        imageStyle={{ flex: 1, alignSelf: 'center' }}
        eachData={dataSet.item}
        onPress={() => props.onPress(dataSet.item)}
        type='list'
      />
    );
  };

  renderOffersList = (dataSet) => {
    return (
      <CustomFlatlistItem
        viewContainerStyle={{ width: Size.WINDOW_WIDTH / 2 }}
        imageStyle={{ alignSelf: 'center' }}
        eachData={dataSet.item}
        onPress={() => props.onPress(dataSet.item)}
        type='offers'
      />
    );
  };

  renderProductsItem = (dataSet) => {
    return (
      <CustomFlatlistItem
        viewContainerStyle={{ width: Size.WINDOW_WIDTH / 2 }}
        imageStyle={{ alignSelf: 'center' }}
        eachData={dataSet.item}
        onPress={() => props.onPress(dataSet.item)}
        type='product_item'
      />
    );
  };

  return (
    <View style={styles.containerStyle}>
      {
        flatlistType == 'list' && props.headerVisable && props.data.length ?
          <View style={{ flexDirection: 'row', marginVertical: 8, marginLeft: 12, alignItems: 'center', justifyContent: 'space-between', }}>
            <Text style={{ fontWeight: 'bold' }}>{`Top ${allData.length} restaurants`}<Text style={{ color: Constants.appColors.MENU_COLOR }}> near you</Text></Text>
            <TouchableOpacity onPress={() => setModalActive(true)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                <AntIcon name='equalizer' size={18} />
                <Text style={{ padding: 4, fontSize: 14 }}>Filter</Text>
              </View>
            </TouchableOpacity>
          </View>
          : <></>
      }
      {
        props.title ? <Text style={props.titleStyle}>{props.title}</Text> : <></>
      }

      <FlatList
        LisHeaderComponent={props.LisHeaderComponent}
        renderItem={flatlistType == 'list' ? renderItemList : flatlistType == 'product_item' ? renderProductsItem : renderOffersList}
        keyExtractor={(item, index) => `${props.key} ${index.toString()}`}
        data={allData}
        numColumns={props.numColumns}
        showsVerticalScrollIndicator={false}
        type={flatlistType}
        title={props.title}
        key={props.key}
        contentContainerStyle={props.contentContainerStyle}
      />
    </View>
  );

}

export default CustomFlatlist;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Constants.appColors.TRANSPARENT,
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    width: Size.WINDOW_WIDTH * .62,
    bottom: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});