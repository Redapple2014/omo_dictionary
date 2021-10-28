import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Constants from '../../utills/Constants';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useTranslation } from 'react-i18next';
import Sizes from '../../utills/Size';
import Toast from 'react-native-simple-toast';
import Tts from 'react-native-tts';
import { NAVIGATION_FLASH_CARD_DATA_SCREEN_PATH } from '../../navigations/Routes';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import { CheckBox } from 'react-native-elements';
import PouchDB from 'pouchdb-react-native';
import { NAVIGATION_NEW_CARD_SCREEN_PATH } from '../../navigations/Routes';
import { NavigationEvents } from 'react-navigation';
import CustomPopup from '../../components/popup/CustomPopup';
import CustomButton from '../../components/button/CustomButton';
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

const DisplayCardScreen = (props) => {
  const id = props.navigation.getParam('data', 'nothing sent');
  const [data, setData] = useState();
  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState([]);
  const [leftItems, setLeftItems] = useState();
  const [newSet, setNewSet] = useState([]);
  const [isOverlayActive, setOverlayActive] = useState(false);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [selectedCategory, setSelectedCategoty] = useState()
  const [allCategories, setAllCategoies] = useState([]);
  const [displayCategory, setDisplayCategory] = useState([]);
  const [category, setCategory] = useState('');

  const [myCardData, setMyCardData] = useState();
  const { t, i18n } = useTranslation();

  //Function to check if the item is checked or not
  const isChecked = (itemId) => {
    try {
      const isThere = items.includes(itemId);
      return isThere;
    } catch (e) {
      console.log(e);
    }
  };

  //Function to toggle the item(check and uncheck)
  const toggleChecked = (itemId, item) => {
    const x = [itemId, ...items];
    const y = [item, ...newSet];
    if (isChecked(itemId)) {
      setItems(items.filter((id) => id !== itemId));
      setNewSet(newSet.filter((item, index) => index !== itemId));
    } else {
      setItems(x);
      setNewSet(y);
    }
  };

  //function handle the delete fash card items
  const handelDelete = () => {
    let x = leftItems.filter(
      (i) => !newSet.some((j) => i.koreanHeadWord === j.koreanHeadWord),
    );
    console.log('selected : ', newSet)
    console.log('will keep : ', x)

    if (newSet.length != 0) {
      let arr = []
      newSet.forEach((item, index) => {
        arr.push(item.id)
      })

      console.log(arr)

      const query = `DELETE FROM cards WHERE id IN (${arr})`

      console.log(query)

      db.transaction((tx) => {
        tx.executeSql(query, [], (tx, results) => {
          var len = results.rows.raw(0)[0];
          console.log('len item : ', len);
          setEditMode(false)
          fetchData()
        });
      });


    } else {
      Toast.show(`${t('SelectItemToDeleteText')}`, Toast.SHORT);
    }
  };


  //get all category details
  async function getAllcategorys() {
    const query = `SELECT * FROM categories order by cat_order`;
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        let temp = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          temp.push(row);
        }
        console.log('all ategories : ', temp)
        setAllCategoies(temp)
        // let x = temp.filter((item,index)=>item.name!=currentCategory.name)
        // console.log('x : ',x)
        // setDisplayCategory(x)
      });
    });
  }

  //function to fetch the data
  async function fetchCatData() {
    const query = `SELECT * FROM categories WHERE categories.id = ${id}`;
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.raw(0)[0];
        console.log('current categoty  : ', len);
        setCurrentCategory(len);
      });
    });
  }

  //Function responceble to drag items
  const moveHandel = () => {
    if (category) {
      if (currentCategory.name != category) {
        let arr = []
        newSet.forEach((item, index) => {
          arr.push(item.id)
        })
        const query = `UPDATE cards SET category_id = ${selectedCategory.id} WHERE id In (${arr})`
        console.log('Move : ', query)

        db.transaction((tx) => {
          tx.executeSql(query, [], (tx, results) => {
            var len = results.rows.raw(0)[0];
            console.log('len item : ', len);
            setEditMode(false)
            setOverlayActive(!isOverlayActive)
            fetchData()
          });
        });
      } else {
        Toast.show(`Cann't move to same category`, Toast.SHORT);
      }
    } else {
      Toast.show(`${t('SelectCategoryToMove')}`, Toast.SHORT);
    }
  };



  const handelSave = () => {
      const len = myCardData.length;
      for (let i = 0; i < len; i++) {
        const query = `UPDATE cards SET card_order = ${i+1} WHERE id = ${myCardData[i].id}`
        console.log('Move : ', query)
        db.transaction((tx) => {
          tx.executeSql(query, [], (tx, results) => {
          });
        });
      }
      fetchData()
      props.navigation.setParams({ edit: !editMode });
      setItems([]);
      setEditMode(!editMode);
  }

  const renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <View
        style={{
          paddingRight: 8,
          paddingLeft: editMode ? 48 : 8,
          paddingHorizontal: 8,
          marginHorizontal: 6,
          borderRadius: 10,
          backgroundColor: 'white',
          paddingVertical: 4,
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          flex: 0.5,
          marginTop: index == 0 ? 6 : 0,
        }}>
        {editMode && (
          <View
            style={{
              left: -50,
              alignItems: 'center',
              zIndex: 3,
              width: 40,
              height: 50,
            }}>
            <CheckBox
              checkedColor={Constants.appColors.PRIMARY_COLOR}
              containerStyle={{
                backgroundColor: Constants.appColors.TRANSPARENT,
                zIndex: 4,
              }}
              size={20}
              title=""
              checkedIcon="check-square"
              uncheckedIcon="square"
              checked={isChecked(index)}
              onPress={() => toggleChecked(index, item)}
            />
          </View>
        )}
        <TouchableOpacity
          onLongPress={move}
          onPressOut={moveEnd}
          onPress={() => {
            !editMode &&
              props.navigation.navigate(
                NAVIGATION_FLASH_CARD_DATA_SCREEN_PATH,
                { item },
              );
          }}>
          <View
            style={{
              width: editMode
                ? Sizes.WINDOW_WIDTH - 70
                : Sizes.WINDOW_WIDTH - 32,
              left: editMode ? -45 : 0,
            }}>
            <View
              style={{
                position: 'absolute',
                zIndex: 3,
                right: editMode ? 42 : 16,
                top: 8,

              }}>
              <TouchableOpacity
                onPress={() => {
                  try {
                    Tts.setDefaultLanguage('ko-KR');
                    Tts.speak(item?.speech);
                  } catch (e) {
                    console.log(`cannot play the sound file`, e);
                    Toast.show(`${t('NoAudioFileFoundText')}`, Toast.SHORT);
                  }
                }}>
                <Image
                  source={require('../../assets/logo/audio-black-icon.png')}
                  style={{ width: 18, height: 18, resizeMode: 'contain' }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={[
                  styles.TextStyle,
                  { left: -8, width: editMode ? Sizes.WINDOW_WIDTH - 130 : Sizes.WINDOW_WIDTH - 70 },
                ]}
                numberOfLines={1}>
                {item?.koreanHeadWord}
                {item?.englishHeadWord && `(${item?.englishHeadWord})`}
              </Text>
              <Text
                style={[
                  styles.TextStyle,
                  {
                    left: -8,
                    color: Constants.appColors.GRAY,
                    fontSize: 12,
                    paddingVertical: 2,
                  },
                ]}>
                {item?.speech}
              </Text>

              <Text
                style={[
                  styles.TextStyle,
                  {
                    left: -8,
                    paddingVertical: 2,
                    fontSize: 15,
                    color: Constants.appColors.BLACK,
                  },
                ]}>
                {item?.definition}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {editMode && (
          <View style={{ left: -70, justifyContent: 'center' }}>
            <MIcons
              name="view-headline"
              size={22}
              color={Constants.appColors.PRIMARY_COLOR}
            />
          </View>
        )}
      </View>
    );
  };

  //fetch falshcard data using sorting by category name
  function fetchData() {
    const query = `SELECT categories.id, categories.name, categories.type, categories.cat_order, JSON_GROUP_ARRAY(json_object('id', cards.id, 'word_id', cards.word_id,'speech', cards.speech,'hanja', cards.hanja,'englishHeadWord', cards.englishHeadWord,'definition', cards.definition,'examples', cards.examples,'koreanHeadWord',cards.koreanHeadWord,'card_order', cards.card_order)) AS allCards FROM categories LEFT JOIN cards on categories.id = cards.category_id WHERE  categories.id = ${id} GROUP BY categories.id order by categories.cat_order`;
    console.log(query)
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        console.log('Query completed : ', len);
        var temp = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          row.cards = JSON.parse(row.allCards);
          row.cards = row.cards.filter((item) => item.id != null);
          row.cards = row.cards.sort((a,b) => (a.card_order > b.card_order) ? 1 : ((b.card_order > a.card_order) ? -1 : 0))
          temp.push(row);
        }
        console.log('temp *******', ...temp)
        setData(...temp);
        setMyCardData(temp[0].cards)
        setLeftItems(temp[0].cards)
      });
    });
  }

  useEffect(() => {
    fetchCatData();
    getAllcategorys()

  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationEvents
        onDidFocus={(payload) => {
          fetchData();
        }}
      />
      <View
        style={{
          backgroundColor: Constants.appColors.PRIMARY_COLOR,
          paddingTop: Platform.OS == 'ios' ? getStatusBarHeight() : 0,
        }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.appColors.PRIMARY_COLOR}
        />
        <View style={styles.container}>
          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'absolute',
              left: 4,
              top: 6,
            }}>
            {editMode ? (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.setParams({ edit: !editMode });
                  setEditMode(!editMode);
                  setItems([]);
                  setNewSet([])
                }}>
                <Text style={{ fontSize: 20, color: 'white', top: 2 }}>{`${t(
                  'CancelText',
                )}`}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.setParams({ edit: !editMode });
                  setEditMode(!editMode);
                  props.navigation.dispatch(NavigationActions.back());
                }}>
                <Text style={{ fontSize: 20, color: 'white', top: 2 }}>{`${t(
                  'BackText',
                )}`}</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[styles.textStyle2, , { borderWidth: 0, width: 150 }]}>
            {!editMode ? data?.name : `Edit Cards`}
          </Text>
          <View
            style={{
              padding: 6,
              alignSelf: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'absolute',
              borderWidth: 0,
              right: 4,
              top: 2,
            }}>
            {!editMode ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    console.log('final move : ', data)
                    return props.navigation.navigate(NAVIGATION_NEW_CARD_SCREEN_PATH, {
                      path: data,
                    })
                  }
                  }>
                  <View style={{ marginHorizontal: 12 }}>
                    <MIcons
                      name="insert-drive-file"
                      size={23}
                      color={Constants.appColors.WHITE}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (1) {
                      props.navigation.setParams({ edit: !editMode });
                      console.log('edit press');
                      setEditMode(!editMode);
                    } else {
                      Toast.show('No data found to edit', Toast.SHORT);
                    }
                  }}>
                  <MIcons
                    name="edit"
                    size={23}
                    color={
                      1
                        ? Constants.appColors.WHITE
                        : `rgba(255,255,255, 0.7)`
                    }
                  />
                </TouchableOpacity>
              </>
            ) : (
              <View
                style={{
                  width: 85,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  right: 4,
                  top: -2,
                }}>
                <TouchableOpacity onPress={handelDelete}>
                  <MIcons
                    name="delete"
                    size={23}
                    color={Constants.appColors.WHITE}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Move');
                    setOverlayActive(!isOverlayActive);
                  }}>
                  <Image
                    source={require('../../assets/logo/arrow-icon.png')}
                    style={{ width: 30, height: 30, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handelSave}>
                  <MIcons
                    name="check"
                    size={23}
                    color={Constants.appColors.WHITE}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {newSet.length > 0 && (
          <CustomPopup
            visible={isOverlayActive}
            onRequestClose={() => setOverlayActive(!isOverlayActive)}
            transparent={true}
            animationType="fade"
            modalContainerStyle={{
              height: Sizes.WINDOW_HEIGHT,
              backgroundColor: 'white',
              width: '100%',
              maxHeight: Sizes.WINDOW_HEIGHT * 0.5,
            }}>
            <View style={{ paddingHorizontal: 12, paddingTop: 8, flex: 1 }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, marginBottom: 12 }}>{`${t(
                  'SelectCategoryText',
                )}`}</Text>
                <TouchableOpacity
                  onPress={() => { setOverlayActive(!isOverlayActive); setSelectedCategoty({}); setCategory('') }}>
                  <Icon
                    name="closecircle"
                    size={24}
                    color={Constants.appColors.PRIMARY_COLOR}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                keyboardShouldPersistTaps={'handled'}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setCategory(item?.name);
                      setSelectedCategoty(item)
                    }}>
                    <View
                      style={{
                        borderWidth: 0.5,
                        marginVertical: 4,
                        borderRadius: 10,
                        borderColor: Constants.appColors.LIGHTGRAY,
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          paddingLeft: 4,
                          paddingVertical: 8,
                          color:
                            item?.name == category
                              ? Constants.appColors.PRIMARY_COLOR
                              : Constants.appColors.BLACK,
                        }}>
                        {item?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                data={allCategories}
                numColumns={1}
                showsVerticalScrollIndicator={false}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: Platform.OS == 'ios' ? 20 : 12,
                }}>
                <CustomButton
                  style={{
                    height: 40,
                    width: Sizes.WINDOW_WIDTH - 32,
                    backgroundColor: Constants.appColors.TRANSPARENT,
                    borderWidth: 1,
                    borderColor: Constants.appColors.DARKGRAY,
                    borderRadius: 10,
                  }}
                  title={`${t('MoveText')}`}
                  titleStyle={{
                    fontSize: 14,
                    color: Constants.appColors.DARKGRAY,
                    fontWeight: 'bold',
                  }}
                  onPress={moveHandel}
                />
              </View>
            </View>
          </CustomPopup>
        )}
      </View>
      <View style={{ flex: 1 }}>
        {editMode ? (
          <DraggableFlatList
            data={myCardData}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              `draggable-item-${index}${item.englishHeadWord}`
            }
            scrollPercent={5}
            onMoveEnd={({ data }) => setMyCardData(data)
            }
          />
        ) : (
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              `draggable-item-${index}${item.englishHeadWord}`
            }
            data={myCardData}
            numColumns={1}
            showsVerticalScrollIndicator={false}
          />
        )}

        {data?.cards.length == 0 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              position: 'absolute',
              top: Sizes.WINDOW_HEIGHT * 0.35 - 32,
            }}>
            <Image
              source={require('../../assets/logo/grey-bookmark.png')}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ paddingTop: 4 }}>{`${t('NoCardFoundText')}`}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

DisplayCardScreen.navigationOptions = {
  headerShown: false,
};

export default DisplayCardScreen;

const styles = StyleSheet.create({
  spinnerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: Sizes.WINDOW_HEIGHT / 2 - 24,
    left: Sizes.WINDOW_WIDTH / 2 - 24,
    zIndex: 2,
  },
  TextStyle: {
    fontSize: 16,
    color: Constants.appColors.BLACK,
    paddingLeft: 12,
  },
  container: {
    backgroundColor: Constants.appColors.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  textStyle2: {
    color: Constants.appColors.WHITE,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addressContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },
});
