// 濁音変換
// wiki: https://ja.wikipedia.org/wiki/%E6%BF%81%E9%9F%B3
// ka => ga
// sa => za
// ta => da
// ha => ba
const translateDakutenHeadWords = {
  "k": "g",
  "s": "z",
  "t": "d",
  "h": "b"
}
var toDakuten = (text)=>{
  let firstText = text.charAt(0)
  // textの先頭1文字目がkeyに一致していたら、valueに変換する
  for (let word in translateDakutenHeadWords) {
    if (word == firstText) {
      return translateDakutenHeadWords[word]+text.slice(1);
    }
  }
  return text
}
// 半濁音変換
//https://ja.wikipedia.org/wiki/%E5%8D%8A%E6%BF%81%E9%9F%B3
const translateHanDakutenHeadWords = {
  "h": "p"
}
var toHanDakuten = (text)=>{
  let firstText = text.charAt(0)
  // textの先頭1文字目がkeyに一致していたら、valueに変換する
  for (let word in translateHanDakutenHeadWords) {
    if (word == firstText) {
      return translateHanDakutenHeadWords[word]+text.slice(1);
    }
  }
  return text
}
// 数字変換
const translateNumber = {
  "ro": "0",
  "a": "1",
  "i": "2",
  "u": "3",
  "ru": "4",
  "ra": "5",
  "e": "6",
  "re": "7",
  "ri": "8",
  "o": "9",
  "ltu": ".",
  "wa": ",",
}
var toSuuji = (text)=>{
  if (translateNumber[text] != undefined) {
    return translateNumber[text]
  }
  return text
}
// アルファベット変換
// https://nagoya-lighthouse.jp/mather/brail/alpha.html
const translateAlphabet = {
  "a": ".a",
  "i": ".b",
  "u": ".c",
  "ru": ".d",
  "ra": ".e",
  "e": ".f",
  "re": ".g",
  "ri": ".h",
  "o": ".i",
  "ro": ".j",
  "na": ".k",
  "ni": ".l",
  "nu": ".m",
  "tu": ".n",
  "ta": ".o",
  "ne": ".p",
  "te": ".q",
  "ti": ".r",
  "no": ".s",
  "to": ".t",
  "ha": ".u",
  "hi": ".v",
  "so": ".w",
  "hu": ".x",
  "mu": ".y",
  "ma": ".z"
}
var toAlphabet = (text)=>{
  if (translateAlphabet[text] != undefined) {
    return translateAlphabet[text]
  }
  //return text
}
var toLargeAlphabet = (text)=>{
  if (translateAlphabet[text] != undefined) {
    return translateAlphabet[text].toUpperCase()
  }
  return text
}
// 拗音変換
// http://www.braille.jp/topics/yonndemiyo.html
const translateYouonn = {
  "ka": "kya",
  "ku": "kyu",
  "ko": "kyo",
  "sa": "sya",
  "su": "syu",
  "so": "syo",
  "ta": "cya",
  "tu": "cyu",
  "to": "cyo",
  "na": "nya",
  "nu": "nyu",
  "no": "nyo",
  "ha": "hya",
  "hu": "hyu",
  "ho": "hyo",
  "ma": "mya",
  "mu": "myu",
  "mo": "myo",
  "ra": "rya",
  "ru": "ryu",
  "ro": "ryo"
}
const translateDakuYouonn = {
  "ka": "gya",
  "ku": "gyu",
  "ko": "gyo",
  "sa": "jya",
  "su": "jyu",
  "so": "jyo",
  "ta": "dya",
  "tu": "dyu",
  "to": "dyo",
  "ha": "bya",
  "hu": "byu",
  "ho": "byo",
}
const translateHanDakuYouonn = {
  "ha": "pya",
  "hu": "pyu",
  "ho": "pyo",
}
var toYouonn = (text)=>{
  if (translateYouonn[text] != undefined) {
    return translateYouonn[text]
  }
  return text
}
var toDakuYouonn = (text)=>{
  if (translateDakuYouonn[text] != undefined) {
    return translateDakuYouonn[text]
  }
  return text
}
var toHanDakuYouonn = (text)=>{
  if (translateHanDakuYouonn[text] != undefined) {
    return translateHanDakuYouonn[text]
  }
  return text
}