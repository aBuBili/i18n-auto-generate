"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
//初始化词典文件
getDictionaryInitFun();
// 获取当前目录下的所有文件
const folderChoices = findCurFolderDirectory();
// 选择执行
if (folderChoices.length == 0) {
    console.log("🚀 ~ 没有可以处理的文件！");
}
else {
    // 获取同等级下的所有目录
    inquirer_1.default
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
var enObj = {}; // 所有键值对 - 英文
var temp = ""; // 单文件字符串内容
var fileArr = []; // 所有层级的文件
var path = ""; // 递归开始目录
var dictionary = {}; // 词典文件
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
async function replaceChinese() {
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
function fun(path) {
    const stats = fs_1.default.statSync(path);
    // 是tsx文件 不是less文件
    if (stats.isFile() && path.indexOf(".less") == -1) {
        fileArr.push(path);
    }
    // 是目录 去查他下面的所有文件
    if (stats.isDirectory()) {
        const files = fs_1.default.readdirSync(path + "/");
        // 遍历文件夹下面所有的文件名
        for (let e of files) {
            // mac系统会有这个文件 这个文件就跳过
            if (e == ".DS_Store")
                return null;
            fun(`${path}/${e}`);
        }
    }
}
// 识别 当前目录下的所有文件
function findCurFolderDirectory() {
    const list = [];
    const parentFile = path_1.default.resolve(__dirname, "./") + "/";
    const files = fs_1.default.readdirSync(parentFile);
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
async function dealPageFun(path) {
    temp = readFileFun(path);
    let curPageChineseArr = [];
    let transArr = [];
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
    let chineseArr = [];
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
    temp = temp.replace(/(>)([\u4e00-\u9fa5，。！？；a-zA-Z,.!?]+)(<\/)/g, (str) => {
        chineseArr.push({
            text: str.slice(1, -2),
            type: "tagText",
            index,
        });
        return `@=${index++}=#`;
    });
    return chineseArr;
}
// 翻译 传入中文字符串 用\n分割  返回翻译好的数组
function translateFun(query = "", to) {
    let appKey = "4c45db8c6b1cd6ac";
    let key = "CbRY2Jgdp2RrFDrUBRryNDvzDpHnsHxN";
    let curtime = Math.round(new Date().getTime() / 1000);
    let salt = "abuuio" + Math.round(Math.random() * 100);
    let str1 = appKey + truncate(query) + salt + curtime + key;
    let sign = crypto_js_1.default.SHA256(str1).toString(crypto_js_1.default.enc.Hex);
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
    axios_1.default.defaults.headers.post["content-Type"] =
        "application/x-www-form-urlencoded;charset=UTF-8";
    axios_1.default.defaults.transformRequest = [
        function (data) {
            let ret = "";
            for (let it in data) {
                ret +=
                    encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
            }
            return ret;
        },
    ];
    return new Promise((resolve) => {
        axios_1.default
            .post(url, params)
            .then(function ({ data }) {
            const { errorCode, translation } = data;
            if (errorCode == "0") {
                resolve(translation[0].split("\n") || []);
            }
            else {
                console.log("翻译接口错误 错误代码 --", errorCode);
            }
        })
            .catch(function () {
            console.log("axios 错误");
        });
    });
    // input
    function truncate(q) {
        var len = q.length;
        if (len <= 20)
            return q;
        return q.substring(0, 10) + len + q.substring(len - 10, len);
    }
}
// 生成key 包括去重 截取
function newKeyFun(chi, en) {
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
        }
        else {
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
function replaceSlotFun(index, key, type) {
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
async function generateOtrLanguageFun(lan) {
    let jaObj = {};
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
function writeDictionaryFun(obj) {
    let json = "module.exports = index =" + JSON.stringify(obj).replaceAll('","', '",\n"');
    writeFileFun("dictionary.js", json);
    console.log("写入词典--" + path + "--");
}
// 写入英文json
function writeEnFun(obj) {
    let json = "const index = " +
        JSON.stringify(obj)
            .replaceAll(',"', ",\n")
            .replaceAll('":', ": ")
            .replace('{"', "{");
    writeFileFun("en-json.js", json);
    console.log("写入英文--" + path + "--");
}
// 写入日本json
function writeJaFun(obj) {
    let json = "const index = \n" +
        JSON.stringify(obj)
            .replaceAll('","', '",\n')
            .replaceAll('":"', ':"')
            .replace('{"', "{");
    writeFileFun("ja-json.js", json);
    console.log("写入日文--" + path + "--");
}
// 读文件 同步
function readFileFun(path) {
    const data = fs_1.default.readFileSync(path);
    return data.toString();
}
// 写文件 异步
function writeFileFun(path, content) {
    //   写入
    fs_1.default.writeFile(path, content, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log(path, "写入文件完成！");
    });
}
// 获取词典文件
function getDictionaryInitFun() {
    const dicPath = "dictionary.js";
    const exit = fs_1.default.existsSync(dicPath);
    if (exit) {
        dictionary = JSON.parse(readFileFun(dicPath).replace("module.exports = index =", ""));
    }
}
