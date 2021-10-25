import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from '../../components/header';
import {NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH} from '../../navigations/Routes';
import {useTranslation} from 'react-i18next';
import EIcons from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';
import Dialog from 'react-native-dialog';
import {
  NAVIGATION_NEW_CARD_SCREEN_PATH,
  NAVIGATION_DISPLAY_CARD_SCREEN_PATH,
} from '../../navigations/Routes';
import Toast from 'react-native-simple-toast';
import {CheckBox} from 'react-native-elements';
import PouchDB from 'pouchdb-react-native';
import {NavigationEvents} from 'react-navigation';

PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');

const FlashcardScreen = (props) => {
  const [myData, setData] = useState([]);
  const {t, i18n} = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [items, setItems] = useState([]);

  //insert category function handeller
  async function insert() {
    console.log(newCategoryName);

    const query = `SELECT * FROM categories WHERE name = '${newCategoryName}'`;
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        console.log(len, newCategoryName);
        if (len == 0) {
          console.log('call created');
          insertData();
        } else {
          console.log('have');
          Toast.show('Category already exist', Toast.SHORT);
        }
      });
    });
  }

  //insert function to create a new category
  async function insertData() {
    const query = `INSERT INTO categories(name,type,cat_order) VALUES(?,?,?);`;
    db.transaction((tx) => {
      tx.executeSql(query, [newCategoryName, 'custom', 1], (tx, results) => {
        setNewCategoryName('');
        console.log('inserted categories: ', results);
      });
    });
    fetchData();
  }

  //fetch function
  async function fetchData() {
    const query = `SELECT categories.id, categories.name, categories.type, categories.cat_order, 
        JSON_GROUP_ARRAY(json_object('id', cards.id, 
                                      'word_id', cards.word_id,
                                      'speech', cards.speech,
                                      'hanja', cards.hanja,
                                      'englishHeadWord', cards.englishHeadWord,
                                      'definition', cards.definition,
                                      'examples', cards.examples,
                                      'koreanHeadWord',cards.koreanHeadWord,
                                      'card_order', cards.card_order)) 
        AS allCards
    FROM categories
    LEFT JOIN cards on categories.id = cards.category_id
    GROUP BY categories.id
    order by categories.cat_order`;
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        console.log('len : ' ,len);
        var temp = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          row.cards = JSON.parse(row.allCards);
          row.cards = row.cards.filter((item) => item.id != null);
          temp.push(row);
        }
        // console.log('temp : ',temp)
        setData(temp);
      });
    });
  }

  //dalete data function
  async function deleteData() {

    console.log('seletced items : ',items)
    items.map((item) => {
      const query = `DELETE FROM categories WHERE id = '${item}'`;
      db.transaction((tx) => {
        tx.executeSql(query, [], (tx, results) => {
          console.log(results)
        });
      });
    });


    setItems([]);
    fetchData();
    setEditMode(false)
  }

  const initCat = async () => {
    const query = `INSERT INTO categories(name,type,cat_order) VALUES('Uncategorized','default',999);`;

    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        console.log('inserted categories: ', results);
        fetchData()
      });
    });
  };

  const checkInit = async () => {
    // const query = `DROP TABLE IF EXISTS categories `;
    const query = `SELECT * FROM categories WHERE name = 'Uncategorized'`;
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var len = results.rows.length;
        console.log(len);

        if (len == 0) {
          initCat();
        } else {
          return;
        }
      });
    });
  };

  //render each category with drag feature
  const renderItem = ({item, index, move, moveEnd, isActive}) => {
    // console.log('item : ',item)
    return (
      <TouchableOpacity
        onPress={() =>
          !editMode &&
          props.navigation.navigate(NAVIGATION_DISPLAY_CARD_SCREEN_PATH, {
            data: item,
          })
        }
        onLongPress={move}
        onPressOut={moveEnd}>
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingVertical: 2,
            marginVertical: 6,
            marginHorizontal: 6,
            borderRadius: 10,
            marginTop: index == 0 ? 6 : 0,
          }}>
          <View
            style={{
              width: Sizes.WINDOW_WIDTH - 64,
              backgroundColor: isActive
                ? Constants.appColors.PRIMARY_COLOR
                : Constants.appColors.WHITE,
              alignItems: 'center',
              marginLeft: 8,
              flexDirection: 'row',
            }}>
            {editMode && item?.name != 'Uncategorized' && (
              <View style={{left: -4, zIndex: 4}}>
                <CheckBox
                  checkedColor={Constants.appColors.PRIMARY_COLOR}
                  containerStyle={{
                    backgroundColor: Constants.appColors.TRANSPARENT,
                    padding: 0,
                    margin: 0,
                  }}
                  size={20}
                  title=""
                  checkedIcon="check-square"
                  checked={isChecked(item?.id)}
                  uncheckedIcon="square"
                  uncheckedColor={Constants.appColors.LIGHTGRAY}
                  onPress={() => toggleChecked(item?.id)}
                />
              </View>
            )}
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontWeight: '700',
                  color: isActive
                    ? Constants.appColors.WHITE
                    : Constants.appColors.BLACK,
                  width: Sizes.WINDOW_WIDTH - 92,
                  fontSize: 18,
                  paddingLeft:
                    editMode && item?.name != 'Uncategorized' ? -48 : 8,
                }}>
                {item?.name}
              </Text>
              <Text
                style={{
                  color: isActive
                    ? Constants.appColors.WHITE
                    : Constants.appColors.BLACK,
                  paddingLeft:
                    editMode && item?.name != 'Uncategorized' ? -48 : 8,
                  paddingVertical: 4,
                }}>
                {item?.cards.length} {`${t('CardsText')}`}
              </Text>
            </View>
          </View>
          {editMode && (
            <View style={{marginLeft: 12}}>
              <MIcons
                name="view-headline"
                size={22}
                color={Constants.appColors.PRIMARY_COLOR}
              />
            </View>
          )}
          {!editMode && (
            <View style={{position: 'absolute', right: 16}}>
              <AntDesign
                name="right"
                color={Constants.appColors.PRIMARY_COLOR}
                size={20}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    checkInit();
  }, []);

  //Show dialog popup
  const showDialog = () => {
    setVisible(true);
  };

  //handel cancel function from dialog input
  const handleCancel = () => {
    setNewCategoryName('');
    setVisible(false);
  };

  //handel delete button
  const handleDelete = () => {
    if (items.length == 0) {
      Toast.show('Selet a item to delete', Toast.SHORT);
    } else {
      Alert.alert(`Alert`, `Do you want to delete selected cards`, [
        {
          text: `${t('CancelText')}`,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: `Delete`, onPress: () => deleteData()},
      ]);
    }
  };

  //handel save function from dialog input
  const handleSave = () => {
    if (newCategoryName.length > 0) {
      // console.log('name : ', newCategoryName)
      setVisible(false);
      setNewCategoryName('');
      insert();
    } else {
      Toast.show(`${t('InputEmptyText')}`, Toast.SHORT);
    }
  };

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
  const toggleChecked = (itemId) => {
    const x = [itemId, ...items];

    if (isChecked(itemId)) {
      setItems(items.filter((id) => id !== itemId));
    } else {
      setItems(x);
    }
  };

  return (
    <View style={{flex: 1}}>
      <NavigationEvents onDidFocus={(payload) => fetchData()} />
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
          {editMode && (
            <View
              style={{
                alignSelf: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                left: 4,
                top: 8,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('edit cancel');
                  props.navigation.setParams({edit: !editMode});
                  setItems([]);
                  setEditMode(!editMode);
                }}>
                <Text style={{fontSize: 20, color: 'white'}}>{`${t(
                  'CancelText',
                )}`}</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={[styles.textStyle, {borderWidth: 0}]}>
            {!editMode ? `${t('FlashcardPageTitle')}` : `Edit Cards`}
          </Text>
          <View
            style={{
              borderWidth: 0,
              alignSelf: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'absolute',
              right: 4,
              top: 8,
            }}>
            {!editMode ? (
              <>
                <TouchableOpacity onPress={showDialog}>
                  <FA5Icons
                    name="folder-plus"
                    size={23}
                    color={Constants.appColors.WHITE}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(NAVIGATION_NEW_CARD_SCREEN_PATH)
                  }>
                  <View style={{marginHorizontal: 12}}>
                    <MIcons
                      name="insert-drive-file"
                      size={23}
                      color={Constants.appColors.WHITE}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.setParams({edit: !editMode});
                    console.log('edit press');
                    setEditMode(!editMode);
                  }}>
                  <MIcons
                    name="edit"
                    size={23}
                    color={Constants.appColors.WHITE}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={handleDelete}>
                  <View style={{marginHorizontal: 12}}>
                    <MIcons
                      name="delete"
                      size={23}
                      color={Constants.appColors.WHITE}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log('save press');
                    props.navigation.setParams({edit: !editMode});
                    setItems([]);
                    setEditMode(!editMode);
                  }}>
                  <MIcons
                    name="check"
                    size={23}
                    color={Constants.appColors.WHITE}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        {editMode ? (
          <DraggableFlatList
            data={myData}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              return `draggable-item-${item.id}`}}
            scrollPercent={5}
            onMoveEnd={({data}) => setData(data)}
          />
        ) : (
          <FlatList
            data={myData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `draggable-item-${item.id}`}
          />
        )}
        {myData.length == 0 && (
          <Text
            style={{
              position: 'absolute',
              top: Sizes.WINDOW_HEIGHT * 0.35 - 32,
              left: Sizes.WINDOW_WIDTH / 2 - 64,
            }}>
            No Flash Card Found
          </Text>
        )}
        {visible && (
          <Dialog.Container visible={visible}>
            <Dialog.Title>{`${t('EnterNewCategoryNameText')}`}</Dialog.Title>
            <Dialog.Input
              value={newCategoryName}
              onChangeText={(v) => setNewCategoryName(v)}
            />
            <Dialog.Button
              label={`${t('CancelText')}`}
              onPress={handleCancel}
            />
            <Dialog.Button label={`${t('SaveText')}`} onPress={handleSave} />
          </Dialog.Container>
        )}
      </View>
    </View>
  );
};

FlashcardScreen.navigationOptions = {
  headerShown: false,
};

export default FlashcardScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.appColors.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  textStyle: {
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
