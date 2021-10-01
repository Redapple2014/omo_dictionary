import {openDatabase} from 'react-native-sqlite-storage';

// open database
const db = openDatabase(
  {name: 'omo_en_v1.db', createFromLocation: 1},
  openCB,
  errorCB,
);

// open database failed
function errorCB(err) {
  console.log('SQL Error: ' + err);
}

// open database successfully
function openCB() {
  console.log('Database OPENED');
}

export default db;
