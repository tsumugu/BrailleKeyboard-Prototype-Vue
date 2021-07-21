<template>
  <div class="home">
    <p>{{modeText}}</p>
    <p>{{hiraganaText}}</p>
    <p>{{romajiText}}</p>
  </div>
</template>

<script>
//const axios = require('axios');
/*
配列
--
12
34
56
--
*/
// http://www.braille.jp/topics/yonndemiyo.html
// TODO: 
// 拗音対応
// アルファベット対応
// 符号対応


// 母音
const vowelTable = {
  "a": [1],
  "i": [1, 3],
  "u": [1, 2],
  "e": [1, 2, 3],
  "o": [2, 3]
};
// 子音
const consonantTable = {
  "k": [6],
  "s": [4, 6],
  "t": [4, 5],
  "n": [5],
  "h": [5, 6],
  "m": [4, 5, 6],
  "r": [4]
};
// その他
// 鉤括弧、丸括弧、棒線、点線については難しいので実装せず。
const otherTable = {
  "wa": [5],
  "wo": [4, 5],
  "nn": [4, 5, 6],
  "ya": [2, 5],
  "yu": [2, 5, 6],
  "yo": [2, 4, 5],
  "ltu": [3],
  "-": [3, 4],
  "。": [3, 4, 6],
  "？": [3, 6],
  "！": [3, 4, 5],
}
// 接頭辞
// ※濁拗音・半濁拗音は便宜上命名。
const prefixTable = {
  "dakuten": [4],
  "handakuten": [6],
  "suufu": [2, 4, 5, 6],
  "tunagifu": [5, 6],
  "gaijifu": [4, 6],
  "youonnfu": [2],
  "dakuyouonnfu": [2, 4],
  "handakuyouonnfu": [2, 6],
}
/*
const translateNumber = {
  "0": [2, 3, 4],
  "1": [1],
  "2": [1, 3],
  "3": [1, 2],
  "4": [1, 2, 4],
  "5": [1, 4],
  "6": [1, 2, 3],
  "7": [1, 2, 3, 4],
  "8": [1, 3, 4],
  "9": [2, 3]
}
*/
// キーのマッピング
const map = {
  "7": 1,
  "8": 2,
  "4": 3,
  "5": 4,
  "1": 5,
  "2": 6,
}
var keyCodeToTenji = (key)=> {
  return map[key]
}
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

export default {
  name: 'Home',
  data: function () {
    return {
      hiraganaText: "",
      romajiText: "",
      modeText: "",
      romajiToHiraganaDic: null,
      isDakutenMode: false,
      isHanDakutenMode: false,
      isSuujiMode: false,
      isAlphabetMode: false,
      isLargeAlphabetMode: false,
      isYouonnMode: false,
      isDakuYouonnMode: false,
      isHanDakuYouonnMode: false
    }
  },
  watch: {
    romajiText() {
      // ローマ字をひらがなに変換する
      this.hiraganaText = ""
      if (this.romajiToHiraganaDic != null) {
        this.romajiText.split("/").forEach(e => {
          // eの1文字目が.だったらアルファベットとみなす
          if (e.length == 2 && e.charAt(0) == ".") {
            this.hiraganaText += e.slice(1)
          } else {
            if (this.romajiToHiraganaDic[e] != undefined) {
              this.hiraganaText += this.romajiToHiraganaDic[e]
            } else {
              this.hiraganaText += e
            }
          }
        })
      }
    },
    isDakutenMode() {
      // 他のフラグをリセット
      //this.isDakutenMode = false
      this.isHanDakutenMode = false
      this.isSuujiMode = false
      this.isAlphabetMode = false
      this.isLargeAlphabetMode = false
      this.isYouonnMode = false
      this.isDakuYouonnMode = false
      this.isHanDakuYouonnMode = false
      //
      if (this.isDakutenMode) {
        this.modeText = "【濁点モード】"
      } else {
        this.modeText = ""
      }
    },
    isHanDakutenMode() {
      // 他のフラグをリセット
      this.isDakutenMode = false
      //this.isHanDakutenMode = false
      this.isSuujiMode = false
      this.isAlphabetMode = false
      this.isLargeAlphabetMode = false
      this.isYouonnMode = false
      this.isDakuYouonnMode = false
      this.isHanDakuYouonnMode = false
      //
      if (this.isHanDakutenMode) {
        this.modeText = "【半濁点モード】"
      } else {
        this.modeText = ""
      }
    },
    isSuujiMode() {
      // 他のフラグをリセット
      this.isDakutenMode = false
      this.isHanDakutenMode = false
      //this.isSuujiMode = false
      this.isAlphabetMode = false
      this.isLargeAlphabetMode = false
      this.isYouonnMode = false
      this.isDakuYouonnMode = false
      this.isHanDakuYouonnMode = false
      //
      if (this.isSuujiMode) {
        this.modeText = "【数字モード】"
      } else {
        this.modeText = ""
      }
    },
    isAlphabetMode() {
      // 他のフラグをリセット
      this.isDakutenMode = false
      this.isHanDakutenMode = false
      this.isSuujiMode = false
      //this.isAlphabetMode = false
      //this.isLargeAlphabetMode = false
      this.isYouonnMode = false
      this.isDakuYouonnMode = false
      this.isHanDakuYouonnMode = false
      //
      if (this.isAlphabetMode) {
        this.modeText = "【英字モード】"
      } else {
        this.modeText = ""
      }
    },
    isLargeAlphabetMode() {
      // 他のフラグをリセット
      this.isDakutenMode = false
      this.isHanDakutenMode = false
      this.isSuujiMode = false
      //this.isAlphabetMode = false
      //this.isLargeAlphabetMode = false
      this.isYouonnMode = false
      this.isDakuYouonnMode = false
      this.isHanDakuYouonnMode = false
      //
      if (this.isLargeAlphabetMode) {
        this.modeText = "【英字(大文字)モード】"
      } else {
        this.modeText = "【英字モード】"
      }
    },
    isYouonnMode() {
      // 他のフラグをリセット
      this.isDakutenMode = false
      this.isHanDakutenMode = false
      this.isSuujiMode = false
      this.isAlphabetMode = false
      this.isLargeAlphabetMode = false
      //this.isYouonnMode = false
      this.isDakuYouonnMode = false
      this.isHanDakuYouonnMode = false
      //
      if (this.isYouonnMode) {
        this.modeText = "【拗音モード】"
      } else {
        this.modeText = ""
      }
    },
    isDakuYouonnMode() {
      // 他のフラグをリセット
      this.isDakutenMode = false
      this.isHanDakutenMode = false
      this.isSuujiMode = false
      this.isAlphabetMode = false
      this.isLargeAlphabetMode = false
      this.isYouonnMode = false
      //this.isDakuYouonnMode = false
      this.isHanDakuYouonnMode = false
      //
      if (this.isDakuYouonnMode) {
        this.modeText = "【拗音モード】"
      } else {
        this.modeText = ""
      }
    },
    isHanDakuYouonnMode() {
      // 他のフラグをリセット
      this.isDakutenMode = false
      this.isHanDakutenMode = false
      this.isSuujiMode = false
      this.isAlphabetMode = false
      this.isLargeAlphabetMode = false
      this.isYouonnMode = false
      this.isDakuYouonnMode = false
      //this.isHanDakuYouonnMode = false
      //
      if (this.isHanDakuYouonnMode) {
        this.modeText = "【拗音モード】"
      } else {
        this.modeText = ""
      }
    }
  },
  components: {
  },
  mounted() {
    var allTable = {}
    var pushedKeys = []
    // 母音テーブルと子音テーブルを組み合わせて、50音のテーブルを生成する
    for (let consonant in consonantTable) {
      for (let vowel in vowelTable) {
        allTable[consonant+vowel] = vowelTable[vowel].concat(consonantTable[consonant])
      }
    }
    allTable = Object.assign(allTable, vowelTable)
    allTable = Object.assign(allTable, otherTable)
    allTable = Object.assign(allTable, prefixTable)
    // console.log(allTable);
    // ローマ字 to ひらがなの変換テーブルを作成
    // 毎回生成していると非効率なのでJSONを読み込む
    const romajiToHiraganaDicJSON = '{"-":"ー","~":"〜","z/":"・","z.":"…","z,":"‥","zh":"←","zj":"↓","zk":"↑","zl":"→","z-":"〜","z[":"『","z]":"』","[":"「","]":"」","va":"ゔぁ","vi":"ゔぃ","vu":"ゔ","ve":"ゔぇ","vo":"ゔぉ","vya":"ゔゃ","vyi":"ゔぃ","vyu":"ゔゅ","vye":"ゔぇ","vyo":"ゔょ","qq":"っ","vv":"っ","ll":"っ","xx":"っ","kk":"っ","gg":"っ","ss":"っ","zz":"っ","jj":"っ","tt":"っ","dd":"っ","hh":"っ","ff":"っ","bb":"っ","pp":"っ","mm":"っ","yy":"っ","rr":"っ","ww":"っ","www":"w","cc":"っ","kya":"きゃ","kyi":"きぃ","kyu":"きゅ","kye":"きぇ","kyo":"きょ","gya":"ぎゃ","gyi":"ぎぃ","gyu":"ぎゅ","gye":"ぎぇ","gyo":"ぎょ","sya":"しゃ","syi":"しぃ","syu":"しゅ","sye":"しぇ","syo":"しょ","sha":"しゃ","shi":"し","shu":"しゅ","she":"しぇ","sho":"しょ","zya":"じゃ","zyi":"じぃ","zyu":"じゅ","zye":"じぇ","zyo":"じょ","tya":"ちゃ","tyi":"ちぃ","tyu":"ちゅ","tye":"ちぇ","tyo":"ちょ","cha":"ちゃ","chi":"ち","chu":"ちゅ","che":"ちぇ","cho":"ちょ","cya":"ちゃ","cyi":"ちぃ","cyu":"ちゅ","cye":"ちぇ","cyo":"ちょ","dya":"ぢゃ","dyi":"ぢぃ","dyu":"ぢゅ","dye":"ぢぇ","dyo":"ぢょ","tsa":"つぁ","tsi":"つぃ","tse":"つぇ","tso":"つぉ","tha":"てゃ","thi":"てぃ","ti":"てぃ","thu":"てゅ","the":"てぇ","tho":"てょ","tyu":"てゅ","dha":"でゃ","dhi":"でぃ","di":"でぃ","dhu":"でゅ","dhe":"でぇ","dho":"でょ","dyu":"でゅ","twa":"とぁ","twi":"とぃ","twu":"とぅ","twe":"とぇ","two":"とぉ","tu":"とぅ","dwa":"どぁ","dwi":"どぃ","dwu":"どぅ","dwe":"どぇ","dwo":"どぉ","du":"どぅ","nya":"にゃ","nyi":"にぃ","nyu":"にゅ","nye":"にぇ","nyo":"にょ","hya":"ひゃ","hyi":"ひぃ","hyu":"ひゅ","hye":"ひぇ","hyo":"ひょ","bya":"びゃ","byi":"びぃ","byu":"びゅ","bye":"びぇ","byo":"びょ","pya":"ぴゃ","pyi":"ぴぃ","pyu":"ぴゅ","pye":"ぴぇ","pyo":"ぴょ","fa":"ふぁ","fi":"ふぃ","fu":"ふ","fe":"ふぇ","fo":"ふぉ","fya":"ふゃ","fyu":"ふゅ","fyo":"ふょ","hwa":"ふぁ","hwi":"ふぃ","hwe":"ふぇ","hwo":"ふぉ","hwyu":"ふゅ","mya":"みゃ","myi":"みぃ","myu":"みゅ","mye":"みぇ","myo":"みょ","rya":"りゃ","ryi":"りぃ","ryu":"りゅ","rye":"りぇ","ryo":"りょ","n":"ん","nn":"ん","n":"ん","xn":"ん","a":"あ","i":"い","u":"う","wu":"う","e":"え","o":"お","xa":"ぁ","xi":"ぃ","xu":"ぅ","xe":"ぇ","xo":"ぉ","la":"ぁ","li":"ぃ","lu":"ぅ","le":"ぇ","lo":"ぉ","lyi":"ぃ","xyi":"ぃ","lye":"ぇ","xye":"ぇ","ye":"いぇ","ka":"か","ki":"き","ku":"く","ke":"け","ko":"こ","xka":"ヵ","xke":"ヶ","lka":"ヵ","lke":"ヶ","ga":"が","gi":"ぎ","gu":"ぐ","ge":"げ","go":"ご","sa":"さ","si":"し","su":"す","se":"せ","so":"そ","ca":"か","ci":"し","cu":"く","ce":"せ","co":"こ","qa":"くぁ","qi":"くぃ","qu":"く","qe":"くぇ","qo":"くぉ","kwa":"くぁ","kwi":"くぃ","kwu":"くぅ","kwe":"くぇ","kwo":"くぉ","gwa":"ぐぁ","gwi":"ぐぃ","gwu":"ぐぅ","gwe":"ぐぇ","gwo":"ぐぉ","za":"ざ","zi":"じ","zu":"ず","ze":"ぜ","zo":"ぞ","ja":"じゃ","ji":"じ","ju":"じゅ","je":"じぇ","jo":"じょ","jya":"じゃ","jyi":"じぃ","jyu":"じゅ","jye":"じぇ","jyo":"じょ","ta":"た","ti":"ち","tu":"つ","tsu":"つ","te":"て","to":"と","da":"だ","di":"ぢ","du":"づ","de":"で","do":"ど","xtu":"っ","xtsu":"っ","ltu":"っ","ltsu":"っ","na":"な","ni":"に","nu":"ぬ","ne":"ね","no":"の","ha":"は","hi":"ひ","hu":"ふ","he":"へ","ho":"ほ","ba":"ば","bi":"び","bu":"ぶ","be":"べ","bo":"ぼ","pa":"ぱ","pi":"ぴ","pu":"ぷ","pe":"ぺ","po":"ぽ","ma":"ま","mi":"み","mu":"む","me":"め","mo":"も","xya":"ゃ","lya":"ゃ","ya":"や","wyi":"ゐ","xyu":"ゅ","lyu":"ゅ","yu":"ゆ","wye":"ゑ","xyo":"ょ","lyo":"ょ","yo":"よ","ra":"ら","ri":"り","ru":"る","re":"れ","ro":"ろ","xwa":"ゎ","lwa":"ゎ","wa":"わ","wi":"うぃ","we":"うぇ","wo":"を","wha":"うぁ","whi":"うぃ","whu":"う","whe":"うぇ","who":"うぉ",";":"ー","zd":"゛","zf":"゜","xd":"゙","xf":"゚","xku":"ㇰ","lku":"ㇰ","xsi":"ㇱ","xshi":"ㇱ","lsi":"ㇱ","lshi":"ㇱ","xsu":"ㇲ","lsu":"ㇲ","xto":"ㇳ","lto":"ㇳ","xnu":"ㇴ","lnu":"ㇴ","xha":"ㇵ","lha":"ㇵ","xhi":"ㇶ","lhi":"ㇶ","xhu":"ㇷ","lhu":"ㇷ","xpu":"ㇷ゚","lpu":"ㇷ゚","xhe":"ㇸ","lhe":"ㇸ","xho":"ㇹ","lho":"ㇹ","xmu":"ㇺ","lmu":"ㇺ","xra":"ㇻ","lra":"ㇻ","xri":"ㇼ","lri":"ㇼ","xru":"ㇽ","lru":"ㇽ","xre":"ㇾ","lre":"ㇾ","xro":"ㇿ","lro":"ㇿ"}';
    this.romajiToHiraganaDic = JSON.parse(romajiToHiraganaDicJSON)
    /*
    var romajiToHiragana = {}
    axios.get('https://gist.githubusercontent.com/mandel59/278a4474498546edfedcf7a46073685d/raw/57e8dcce4d2b795187275078bde359bb9c797a5e/romantable.txt')
    .then(function (response) {
      // handle success
      response.data.split('\n').forEach(e=>{
        var tabSplitedText = e.split('\t')
        if (tabSplitedText[0]!=undefined&&tabSplitedText[1]!=undefined) {
          romajiToHiragana[tabSplitedText[0]] = tabSplitedText[1]
        }
      })
      console.log(JSON.stringify(romajiToHiragana));
    })
    */
    // https://gist.githubusercontent.com/mandel59/278a4474498546edfedcf7a46073685d/raw/57e8dcce4d2b795187275078bde359bb9c797a5e/romantable.txt
    // 点字の入力処理
    var kouhoList = []
    var timerId = null
    // 1000ms未操作だった場合に確定する。
    const enterInterval = 500;
    document.addEventListener('keydown', (e)=>{
      if (e.key == "NumpadDecimal" || e.key == ".") {
        this.romajiText = this.romajiText.slice(0, -1);
        pushedKeys = []
      } else {
        var tenji = keyCodeToTenji(e.key);
        if (tenji != undefined) {
          pushedKeys.push(tenji)
        }
        for (let text in allTable) {
          if (JSON.stringify(allTable[text].sort()) == JSON.stringify(pushedKeys.sort())) {
            kouhoList.push(text)
          }
        }
        if (timerId != null) {
          clearTimeout(timerId)
        }
        timerId = setTimeout(()=>{
          if (kouhoList[kouhoList.length-1] == "dakuten") {
            this.isDakutenMode = true
          } else if (kouhoList[kouhoList.length-1] == "handakuten") {
            if (!this.isAlphabetMode) {
              this.isHanDakutenMode = true
            } else {
              // 英字モードのとき、半濁点符は大文字符になる。
              this.isLargeAlphabetMode = true
            }
          } else if (kouhoList[kouhoList.length-1] == "suufu") {
            this.isSuujiMode = true
          } else if (kouhoList[kouhoList.length-1] == "gaijifu") {
            this.isAlphabetMode = true
          } else if (kouhoList[kouhoList.length-1] == "tunagifu") {
            // 数字モード||英字モードのみ、つなぎ符がきたときfalseにする
            this.isSuujiMode = false
            this.isAlphabetMode = false
            this.isLargeAlphabetMode = false
          } else if (kouhoList[kouhoList.length-1] == "youonnfu") {
            this.isYouonnMode = true
          } else if (kouhoList[kouhoList.length-1] == "dakuyouonnfu") {
            this.isDakuYouonnMode = true
          } else if (kouhoList[kouhoList.length-1] == "handakuyouonnfu") {
            this.isHanDakuYouonnMode = true
          } else {
            var dispText = kouhoList[kouhoList.length-1];
            if (this.isDakutenMode) {
              dispText = toDakuten(dispText)
            } else if (this.isHanDakutenMode) {
              dispText = toHanDakuten(dispText)
            } else if (this.isSuujiMode) {
              dispText = toSuuji(dispText)
            } else if (this.isAlphabetMode) {
              if (this.isLargeAlphabetMode) {
                dispText = toLargeAlphabet(dispText)
              } else {
                dispText = toAlphabet(dispText)
              }
            } else if (this.isYouonnMode) {
              dispText = toYouonn(dispText)
            } else if (this.isDakuYouonnMode) {
              dispText = toDakuYouonn(dispText)
            } else if (this.isHanDakuYouonnMode) {
              dispText = toHanDakuYouonn(dispText)
            }
            this.romajiText += dispText+"/"

            this.isDakutenMode = false
            this.isHanDakutenMode = false
            this.isLargeAlphabetMode = false
            this.isYouonnMode = false
            this.isDakuYouonnMode = false
            this.isHanDakuYouonnMode = false
          }
          pushedKeys = []
        }, enterInterval)
      }
    }, false)
  }
}
</script>
