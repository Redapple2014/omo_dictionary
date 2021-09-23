import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import CustomHeader from '../../components/header';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../../components/button/CustomButton';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import Verify from '../../utills/Validation';
import CustomInput from '../../components/input/CustomInput';
import {NavigationActions} from 'react-navigation';
import EIcons from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import auth from '@react-native-firebase/auth';
import {NAVIGATION_LOGIN_SCREEN_PATH} from '../../navigations/Routes';
import {useTranslation} from 'react-i18next';
import database from '@react-native-firebase/database';
import base64 from 'react-native-base64';

const SinupScreen = (props) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSecurePassword, setIsSecurePassword] = useState(true);
  const [isSecureConPassword, setIsSecureConPassword] = useState(true);
  const [isEmailErrorMsg, setIsEmailErrorMsg] = useState(false);
  const [isPasswordErrorMsg, setIsPasswordErrorMsg] = useState(false);
  const [profilePicDetails, setProfilePicDetails] = useState(null);
  const [loading, SetLoading] = useState(false);
  const {t, i18n} = useTranslation();
  const nameInputRef = useRef(null);
  const userNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confPasswordInputRef = useRef(null);

  const chooseFile = () => {
    let options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        setProfilePicDetails(source.assets[0]);
        console.log('source==>', source.assets[0]);
      }
    });
  };

  function setToDefalult() {
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  const registerUser = () => {
    if (
      email.length == 0 ||
      password.length == 0 ||
      name.length == 0 ||
      username == 0
    ) {
      alert(`${t('SignupAlertText')}`);
    } else if (password != confirmPassword) {
      alert(`${t('PasswordMismatchText')}`);
    } else if (!Verify.varifyPassword(password) || !Verify.varifyEmail(email)) {
      alert(`${t('SignupValidationText')}`);
    } else {
      SetLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          const uid = res.user.uid;
          const jsonData = {
            displayName: name,
            username,
            email,
            password: base64.encode(password),
            created_at: new Date().getTime(),
            uid,
          };
          console.log(jsonData);
          try {
            database()
              .ref('users/' + uid)
              .set(jsonData)
              .then(() => {
                SetLoading(false);
                setToDefalult();
                console.log('User registered successfully!');
                props.navigation.navigate(NAVIGATION_LOGIN_SCREEN_PATH);
              });
          } catch (error) {
            console.log('error====>> ', error);
          }
        })
        .catch((error) => {
          alert('Email ID already exist');
          console.log(error);
        });
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: Constants.appColors.PRIMARY_COLOR,
          paddingTop: Platform.OS == 'ios' ? getStatusBarHeight() : 0,
        }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.appColors.PRIMARY_COLOR}
        />
        <CustomHeader
          title={`${t('NewAccountTitle')}`}
          leftIcon={`${t('CancelText')}`}
          onPressleftIcon={() =>
            props.navigation.dispatch(NavigationActions.back())
          }
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={chooseFile}>
            <View
              style={{
                width: 100,
                borderRadius: 50,
                height: 100,
                marginTop: 16,
                marginBottom: 8,
              }}>
              {profilePicDetails === null ? (
                <Image
                  source={require('../../assets/images/profile_pic.png')}
                  style={[
                    {
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      resizeMode: 'contain',
                    },
                  ]}
                />
              ) : (
                <Image
                  source={{uri: profilePicDetails.uri}}
                  style={[
                    {
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      resizeMode: 'cover',
                    },
                  ]}
                />
              )}
              <View
                style={{
                  backgroundColor: Constants.appColors.PRIMARY_COLOR,
                  position: 'absolute',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 72,
                  left: 64,
                  zIndex: 2,
                }}>
                <EIcons name="edit" size={16} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <CustomInput
          label={`${t('NameText')}`}
          ref={nameInputRef}
          labelStyle={{
            fontSize: 14,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          placeholder={`${t('EnterNamePlaceHolder')}`}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
          }}
          keyboardType="email-address"
          leftIconContainerStyle={{marginRight: 16}}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={2}
          containerStyle={{height: 50, marginTop: 8}}
          value={name}
          onChangeText={(value) => {
            setName(value);
          }}
          onSubmitEditing={() => userNameInputRef.current.focus()}
        />
        <CustomInput
          ref={userNameInputRef}
          label={`${t('UsernameText')}`}
          labelStyle={{
            fontSize: 14,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          placeholder={` ${t('EnterUsernamePlaceHolder')}`}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
          }}
          keyboardType="email-address"
          leftIconContainerStyle={{marginRight: 16}}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={2}
          containerStyle={{height: 50, marginTop: 32}}
          value={username}
          onChangeText={(value) => {
            setUsername(value);
          }}
          onSubmitEditing={() => emailInputRef.current.focus()}
        />
        <CustomInput
          label={`${t('EmailText')}`}
          ref={emailInputRef}
          labelStyle={{
            fontSize: 14,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          placeholder={` ${t('EnterEmailPlaceHolder')}`}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
          }}
          keyboardType="email-address"
          leftIconContainerStyle={{marginRight: 16}}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={2}
          containerStyle={{height: 50, marginTop: 32}}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setIsEmailErrorMsg(Verify.varifyEmail(value));
          }}
          errorMessage={
            email && !isEmailErrorMsg ? `${t('EmailInvalidText')}` : ''
          }
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />

        <CustomInput
          label={`${t('PasswordText')}`}
          ref={passwordInputRef}
          labelStyle={{
            fontSize: 14,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
            color: 'red',
          }}
          keyboardType="default"
          RightIconContainerStyle={{marginLeft: 16}}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={10}
          placeholder={` ${t('EnterPasswordText')}`}
          secureTextEntry={isSecurePassword ? isSecurePassword : false}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setIsPasswordErrorMsg(Verify.varifyPassword(value));
          }}
          errorStyle={{color: Constants.appColors.PRIMARY_COLOR}}
          containerStyle={{height: 50, marginTop: 52}}
          errorMessage={
            password && !isPasswordErrorMsg ? `${t('PasswordInvalidText')}` : ''
          }
          onSubmitEditing={() => console.log('submit log in')}
          rightIcon={
            password.length > 0 && (
              <TouchableOpacity
                onPress={() => setIsSecurePassword(!isSecurePassword)}>
                <Icon
                  name={isSecurePassword ? 'eye-off' : 'eye'}
                  size={23}
                  color="#3DB2FF"
                />
              </TouchableOpacity>
            )
          }
          onSubmitEditing={() => confPasswordInputRef.current.focus()}
        />
        <CustomInput
          label={`${t('ConfirmPasswordText')}`}
          ref={confPasswordInputRef}
          labelStyle={{
            fontSize: 14,
            marginBottom: 4,
            marginLeft: 4,
            color: Constants.appColors.DARKGRAY,
            fontWeight: '400',
          }}
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          inputContainerStyle={{
            margin: 4,
            fontSize: 12,
            backgroundColor: 'white',
            borderRadius: 6,
            borderWidth: 0,
            color: 'red',
          }}
          keyboardType="default"
          RightIconContainerStyle={{marginLeft: 16}}
          placeholderTextColor={Constants.appColors.LIGHTGRAY}
          placeholderFontSize={10}
          placeholder={` ${t('ReenterPasswordText')}`}
          secureTextEntry={isSecureConPassword ? isSecureConPassword : false}
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
          }}
          containerStyle={{height: 50, marginTop: 52, marginBottom: 42}}
          onSubmitEditing={() => console.log('submit log in')}
          rightIcon={
            confirmPassword.length > 0 && (
              <TouchableOpacity
                onPress={() => setIsSecureConPassword(!isSecureConPassword)}>
                <Icon
                  name={isSecureConPassword ? 'eye-off' : 'eye'}
                  size={23}
                  color="#3DB2FF"
                />
              </TouchableOpacity>
            )
          }
          onSubmitEditing={registerUser}
        />
        <View style={{alignItems: 'center'}}>
          <CustomButton
            style={{
              height: 40,
              width: Sizes.WINDOW_WIDTH - 32,
              backgroundColor: Constants.appColors.BUTTON_COLOR,
              marginBottom: 8,
              borderRadius: 10,
            }}
            title={`${t('createYourAccountText')}`}
            titleStyle={{fontSize: 14, fontWeight: 'bold'}}
            onPress={registerUser}
          />
        </View>
      </ScrollView>
    </View>
  );
};

SinupScreen.navigationOptions = {
  headerShown: false,
};

export default SinupScreen;
