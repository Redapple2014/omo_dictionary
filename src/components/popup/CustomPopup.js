import React from 'react';
import {View,Modal,StyleSheet} from 'react-native';

const CustomPopup = (props) => {
  return(
        <Modal
          transparent={props.transparent}
          animationType={props.animationType}
          visible={props.visible}
          onRequestClose={props.onRequestClose}>
          <View style={styles.modalStyle}>
            <View style={[styles.modalContainerStyle,props.modalContainerStyle]}>
              {props.children}
            </View>
          </View>
      </Modal>
      );
}

export default CustomPopup;

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex:1,
    justifyContent: 'flex-end',
  }
});