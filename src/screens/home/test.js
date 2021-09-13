let d1 = require('../../resources/dictionary/dict_1_small.json');
let  d2 =require( '../../resources/dictionary/dict_2_small.json');
let  d3 =require( '../../resources/dictionary/dict_3_small.json');
let  d4 =require( '../../resources/dictionary/dict_4_small.json');
let  d5 =require( '../../resources/dictionary/dict_5_small.json');
let  d6 =require( '../../resources/dictionary/dict_6_small.json');
let  d7 =require( '../../resources/dictionary/dict_7_small.json');
let  d8 =require( '../../resources/dictionary/dict_8_small.json');
let  d9 =require( '../../resources/dictionary/dict_9_small.json');
let  d10 =require( '../../resources/dictionary/dict_10_small.json');
let  d11 =require( '../../resources/dictionary/dict_11_small.json');
const fs = require('fs');

const allFiles = [d1, d2, d3, d4,d5,d6,d7,d8,d9,d10,d11]

let newDict = []

console.log('starting....')

for (const file of allFiles){
  for (const item of file){
    let data = {}
    data["_id"] = item["_id"];
    data["name"] = item["Lemma"]["writtenForm"];
    newDict.push(data)
  }
}
console.log('done', newDict, newDict.length)
let json = JSON.stringify(newDict);
fs.writeFile('myjsonfile.json', json, 'utf8', function(err) {
    if (err){
        console.log("error", err)
    }
    else{
      console.log('complete');
    }
   
    });
console.log('done===')