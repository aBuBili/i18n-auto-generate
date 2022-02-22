import fs from "fs";
import CryptoJS from "crypto-js";
import axios from "axios";
import PlatPath from "path";
import inquirer from "inquirer";

interface chineseObj {
  index: number;
  text: string;
  type: string;
}

// 所有参数
var cnObj: { [key: string]: string } = {}; // 所有键值对 - 英文:中文
var enObj: { [key: string]: string } = {}; // 所有键值对 - 英文:英文
var dicObj: { [key: string]: string } = {}; // 所有键值对 - 英文:英文

var dictionary: { [key: string]: string } = {}; // 初始化词典文件
var temp: string = ""; // 单文件字符串内容 因为跨多个处理方法
var fileArr: string[] = []; // 所有层级的文件数组

init();

function init() {
  //初始化词典文件
  getDictionaryInitFun();

  // 选择执行操作
  selsectRunTypeFun();
}

// 选择执行操作
function selsectRunTypeFun() {
  // 获取当前目录下的所有文件
  const folderChoices = findCurFolderDirectory();

  // 选择执行
  if (folderChoices.length == 0) {
    console.log("🚀 ~ 没有可以处理的文件！");
  } else {
    // 获取同等级下的所有目录
    inquirer
      .prompt([
        {
          type: "list",
          message: "请选择需要处理哪一个文件：",
          name: "folder",
          prefix: "- ",
          choices: folderChoices,
        },
        {
          type: "list",
          message: "生成词典还是生成键值对：",
          name: "runType",
          prefix: "- ",
          choices: ["生成词典", "生成键值对"],
        },
      ])
      .then((answer) => {
        const { folder, runType } = answer;
        fun(folder);
        runType == "生成词典" ? getDictionary() : replaceChinese();
      });
  }
}

// 生成词典文件
async function getDictionary() {
  // console.log("🚀 ~ file: line 60 ~ getDictionary ~ getDictionary", dictionary);

  for (let e of fileArr) {
    const { curPageChineseArr, transArr } = await dealPageFun(e);

    for (let { text, index } of curPageChineseArr) {
      let key = newKeyFun(text, transArr[index]);
      dicObj[text] = key;
    }
  }

  writeJsonFun(dicObj, "dic");
}

// 用插槽替换页面中文
async function replaceChinese(): Promise<void> {
  for (let e of fileArr) {
    const { curPageChineseArr, transArr } = await dealPageFun(e);

    for (let { text, type, index } of curPageChineseArr) {
      let key = newKeyFun(text, transArr[index]);
      cnObj[key] = text;
      enObj[key] = key;
      replaceSlotFun(index, key, type);
    }
    writeFileFun(e, temp);
  }

  writeJsonFun(cnObj, "cn"); // key-中文 的对象
  writeJsonFun(enObj, "en"); // key-英文 的对象
  generateOtrLanguageFun("ja");
}

// 抓多层级文件 全同步
function fun(path: string) {
  const stats = fs.statSync(path);

  // 是tsx文件 不是less文件
  if (stats.isFile() && path.indexOf(".less") == -1) {
    fileArr.push(path);
  }

  // 是目录 去查他下面的所有文件
  if (stats.isDirectory()) {
    const files = fs.readdirSync(path + "/");
    // 遍历文件夹下面所有的文件名
    for (let e of files) {
      // mac系统会有这个文件 这个文件就跳过
      if (e == ".DS_Store") return null;
      fun(`${path}/${e}`);
    }
  }
}

// 识别 当前目录下的所有文件
function findCurFolderDirectory(): string[] {
  const list: string[] = [];
  const parentFile = PlatPath.resolve(__dirname, "./") + "/";

  const files = fs.readdirSync(parentFile);
  for (let e of files) {
    e == ".DS_Store" ||
    e == "find-chinese.js" ||
    e == "ja-json.json" ||
    e == "cn-json.json" ||
    e == "en-json.json" ||
    e == "dictionary.json"
      ? ""
      : list.push(e);
  }

  return list;
}

// 获取中文数组 和 翻译数组
async function dealPageFun(path: string) {
  temp = readFileFun(path);
  let curPageChineseArr: chineseObj[] = [];
  let transArr: string[] = [];
  // 拿中文
  curPageChineseArr = findChinese();

  if (curPageChineseArr.length == 0) {
    return {
      curPageChineseArr,
      transArr,
    };
  }

  const chiArr = curPageChineseArr.map((e) => e?.text);
  console.log("中文--" + path + "--");
  // console.log(chiArr);

  // 翻译
  transArr = await translateFun(chiArr.join("\n"), "en");
  console.log("翻译--" + path + "--");
  // console.log(transArr);

  return {
    curPageChineseArr,
    transArr,
  };
}

/*
  找到汉字 换成插槽 三种情况
  ="xxx" => ={intl.formatMessage({ id: 'xxx' })} title placeholder label value
  "xxx" || 'xxx' => intl.formatMessage({ id: 'xxx' }) 对象和new Error里面的文字 正则
  >xxx</ => {intl.formatMessage({ id: 'xxx' })} 标签里面的汉字 全部替换 有个要求 标签里面不要写备注 文字必须用span或者p标签包起来
  temp 页面字符串
*/
function findChinese() {
  //  保存本页中文的对象
  let chineseArr: chineseObj[] = [];
  let index = 0;

  // ="xxx" propsText
  const reg1 = /="([\u4E00-\u9FA5a-zA-Z0-9(),.:!?_（），。：！？‘“ -]+)"/g;
  temp.match(reg1)?.forEach((e) => pushAndReplace(e, [2, -1], "propsText"));

  // >xxx</ tagText
  const reg2 = />([\u4E00-\u9FA5a-zA-Z0-9(),.!?_（），。：！？‘“ -]+)<\//g;
  temp.match(reg2)?.forEach((e) => pushAndReplace(e, [1, -2], "tagText"));

  // "xxx" || 'xxx' objText n
  const reg3 = /(['"])([\u4E00-\u9FA5a-zA-Z0-9(),.!?_（），。：！？‘“ -]+)\1/g;
  temp.match(reg3)?.forEach((e) => pushAndReplace(e, [1, -1], "objText"));

  // 至少有一个中文 不能有="存在 不能为空
  function pushAndReplace(text: string, sub: number[], type: string) {
    const subStr = text.slice(sub[0], sub[1]);

    const hasCn = /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(subStr);
    const miniUnit = true;
    // const miniUnit = subStr.indexOf('="') == -1;

    if (hasCn && miniUnit) {
      chineseArr.push({
        text: subStr,
        type,
        index,
      });
      temp = temp.replace(text, `@=${index++}=#`);
    } else {
      console.log(
        "🚀 ~ file: find-chinese.ts ~ line 199 ~ pushAndReplace ~ text",
        text
      );
    }
  }

  return chineseArr;
}

// 替换插槽
function replaceSlotFun(index: number, key: string, type: string) {
  let slot = `@=${index}=#`;
  switch (type) {
    case "propsText":
      temp = temp.replace(slot, `={intl.formatMessage({ id: '${key}' })}`);
      break;
    case "objText":
      temp = temp.replace(slot, `intl.formatMessage({ id: '${key}' })`);
      break;
    case "tagText":
      temp = temp.replace(slot, `>{intl.formatMessage({ id: '${key}' })}</`);
      break;
  }
}

// 翻译 传入中文字符串 用\n分割  返回翻译好的数组
function translateFun(query = "", to: string): Promise<string[]> {
  let appKey = "4c45db8c6b1cd6ac";
  let key = "CbRY2Jgdp2RrFDrUBRryNDvzDpHnsHxN";
  let curtime = Math.round(new Date().getTime() / 1000);
  let salt = "abuuio" + Math.round(Math.random() * 100);

  let str1 = appKey + truncate(query) + salt + curtime + key;
  let sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

  let url = "https://openapi.youdao.com/api";
  const params = {
    q: query,
    from: "zh-CHS",
    to,
    appKey,
    salt,
    sign,
    signType: "v3",
    curtime: curtime,
  };

  // console.log(params)

  // 请求格式	表单
  axios.defaults.headers.post["content-Type"] =
    "application/x-www-form-urlencoded;charset=UTF-8";
  axios.defaults.transformRequest = [
    function (data: { [x: string]: string | number | boolean }) {
      let ret = "";
      for (let it in data) {
        ret +=
          encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
      }
      return ret;
    },
  ];

  return new Promise((resolve) => {
    axios
      .post(url, params)
      .then(function ({ data }: any) {
        const { errorCode, translation } = data;
        if (errorCode == "0") {
          resolve(translation[0].split("\n") || []);
        } else {
          console.log("翻译接口错误 错误代码 --", errorCode);
        }
      })
      .catch(function () {
        console.log("axios 错误");
      });
  });

  // input
  function truncate(q: string) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
  }
}

// 生成key 包括去重 截取
function newKeyFun(chi: string, en: string): string {
  // 匹配词典
  if (dictionary.hasOwnProperty(chi)) {
    return dictionary[chi];
  }
  // 标点 替换成 "_"
  let key = en.toLocaleLowerCase().replace(/[,.!?()"'，。！？（）"' ]+/g, "_");
  // key去重
  while (cnObj.hasOwnProperty(key)) {
    if (cnObj[key] == chi) {
      break;
    } else {
      key += "m";
    }
  }
  // 如果最后一位是 "_" 则删除
  let lastChar = key.charAt(key.length - 1);
  if (lastChar == "_") {
    key = key.slice(0, -1);
  }
  return key;
}

// 根据英文的json文件 生成其他语言的文件
async function generateOtrLanguageFun(lan: string) {
  let jaObj: {
    [key: string]: string;
  } = {};
  let values = Object.values(cnObj);
  let keys = Object.keys(cnObj);

  let transArr = await translateFun(values.join("\n"), lan);

  keys.forEach((val, index) => {
    jaObj[val] = transArr[index];
  });

  lan == "ja" ? writeJsonFun(jaObj, "ja") : "";
  console.log("🚀 生成其他语言完成 -- " + lan);
}

// 写入json文件
function writeJsonFun(obj: Object, type: string) {
  const str = JSON.stringify(obj).replace(/,"/g, ',\n\t"');
  switch (type) {
    case "cn":
      writeFileFun("cn-json.json", str, "写入中文成功！");
      break;
    case "en":
      writeFileFun("en-json.json", str, "写入英文成功！");
      break;
    case "ja":
      writeFileFun("ja-json.json", str, "写入日文成功！");
      break;
    case "dic":
      writeFileFun("dictionary.json", str, "写入词典成功！");
      break;
  }
}

// 写文件 异步
function writeFileFun(path: string, content: string, successLog?: string) {
  //   写入
  fs.writeFile(path, content, (err: any) => {
    if (err) {
      return console.error(err);
    }
    console.log(successLog ?? "写入文件成功！");
  });
}

// 读文件 同步
function readFileFun(path: string) {
  return fs.readFileSync(path, "utf-8");
}

// 获取词典文件
function getDictionaryInitFun() {
  const dicPath = "dictionary.json";
  const exit = fs.existsSync(dicPath);
  if (exit) {
    dictionary = JSON.parse(readFileFun(dicPath));
    console.log("🚀 字典初始化成功！");
  }
}

export {};
