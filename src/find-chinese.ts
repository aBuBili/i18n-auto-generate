import fs, { PathLike } from "fs";
import CryptoJS from "crypto-js";
import axios from "axios";
import PlatPath from "path";
import inquirer from "inquirer";

interface chineseObj {
  index: number;
  text: string;
  type: string;
}

//初始化词典文件
getDictionaryInitFun();

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
      path = folder;
      runType == "生成词典" ? getDictionary() : replaceChinese();
    });
}

// 结果参数
var enObj: { [key: string]: string } = {}; // 所有键值对 - 英文
var temp: string = ""; // 单文件字符串内容
var fileArr: string[] = []; // 所有层级的文件
var path = ""; // 递归开始目录
var dictionary: { [key: string]: string } = {}; // 词典文件

// 生成词典文件
async function getDictionary() {
  fun(path); // 抓文件
  for (let e of fileArr) {
    const { curPageChineseArr, transArr } = await dealPageFun(e);

    for (let { text, index } of curPageChineseArr) {
      let key = newKeyFun(text, transArr[index]);
      enObj[text] = key;
    }
  }

  writeDictionaryFun(enObj);
}

// 替换页面中文
async function replaceChinese(): Promise<void> {
  fun(path); // 抓文件
  for (let e of fileArr) {
    const { curPageChineseArr, transArr } = await dealPageFun(e);

    for (let { text, type, index } of curPageChineseArr) {
      let key = newKeyFun(text, transArr[index]);
      enObj[key] = text;
      replaceSlotFun(index, key, type);
    }
    // writeFileFun(path, temp)
  }

  writeEnFun(enObj);
  generateOtrLanguageFun("ja");
}

// 识别文件 全同步
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
    e == "ja-json.js" ||
    e == "en-json.js" ||
    e == "dictionary.js"
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
  console.log(chiArr);

  // 翻译
  transArr = await translateFun(chiArr.join("\n"), "en");
  console.log("翻译--" + path + "--");
  console.log(transArr);

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
  temp = temp.replace(/(=")([\u4e00-\u9fa5，。！？；]+)"/g, (str) => {
    chineseArr.push({
      text: str.slice(2, -1),
      type: "propsText",
      index,
    });
    return `@=${index++}=#`;
  });

  // "xxx" || 'xxx' objText
  temp = temp.replace(/(['"])([\u4e00-\u9fa5，。！？；]+)\1/g, (str) => {
    chineseArr.push({
      text: str.slice(1, -1),
      type: "objText",
      index,
    });
    return `@=${index++}=#`;
  });

  // >xxx</ tagText
  temp = temp.replace(
    /(>)([\u4e00-\u9fa5，。！？；a-zA-Z,.!?]+)(<\/)/g,
    (str) => {
      chineseArr.push({
        text: str.slice(1, -2),
        type: "tagText",
        index,
      });
      return `@=${index++}=#`;
    }
  );

  return chineseArr;
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
  let key = en.toLocaleLowerCase().replace(/[\s,.!?]+/g, "_");
  // key去重
  while (enObj.hasOwnProperty(key)) {
    if (enObj[key] == chi) {
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

// 根据英文的json文件 生成其他语言的文件
async function generateOtrLanguageFun(lan: string) {
  let jaObj: {
    [key: string]: string;
  } = {};
  let values = Object.values(enObj);
  let keys = Object.keys(enObj);

  let transArr = await translateFun(values.join("\n"), lan);

  keys.forEach((val, index) => {
    jaObj[val] = transArr[index];
  });

  writeJaFun(jaObj);
  console.log("🚀 生成日语文件");
}

// 写入词典json
function writeDictionaryFun(obj: Object) {
  let json =
    "module.exports = index =" + JSON.stringify(obj).replaceAll('","', '",\n"');
  writeFileFun("dictionary.js", json);
  console.log("写入词典--" + path + "--");
}

// 写入英文json
function writeEnFun(obj: Object) {
  let json =
    "const index = " +
    JSON.stringify(obj)
      .replaceAll(',"', ",\n")
      .replaceAll('":', ": ")
      .replace('{"', "{");
  writeFileFun("en-json.js", json);
  console.log("写入英文--" + path + "--");
}

// 写入日本json
function writeJaFun(obj: Object) {
  let json =
    "const index = \n" +
    JSON.stringify(obj)
      .replaceAll('","', '",\n')
      .replaceAll('":"', ':"')
      .replace('{"', "{");
  writeFileFun("ja-json.js", json);
  console.log("写入日文--" + path + "--");
}

// 读文件 同步
function readFileFun(path: string) {
  const data = fs.readFileSync(path);
  return data.toString();
}

// 写文件 异步
function writeFileFun(path: string, content: string) {
  //   写入
  fs.writeFile(path, content, (err: any) => {
    if (err) {
      return console.error(err);
    }
    console.log(path, "写入文件完成！");
  });
}

// 获取词典文件
function getDictionaryInitFun() {
  const dicPath = "dictionary.js";
  const exit = fs.existsSync(dicPath);
  if (exit) {
    dictionary = JSON.parse(
      readFileFun(dicPath).replace("module.exports = index =", "")
    );
  }
}

export {};
