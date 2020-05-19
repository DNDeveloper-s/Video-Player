/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/assets/js/message.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/assets/js/db.js":
/*!********************************!*\
  !*** ./public/assets/js/db.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const utils = __webpack_require__(/*! ./utils/utilities */ \"./public/assets/js/utils/utilities.js\");\r\n\r\nfunction postRootPath(options) {\r\n    // Fetching it first\r\n    let data = fetchDatabase();\r\n\r\n    if(!data) {\r\n        data = [];\r\n    }\r\n\r\n    const rootObj = {\r\n        root: options.root,\r\n        lastPlayed: false,\r\n        videos: []\r\n    }\r\n\r\n    const curPath = data.find(cur => cur.root === options.root);\r\n\r\n    if(!curPath) {\r\n        data.push(rootObj);\r\n    }\r\n    // const curVideo = curPath.videos.find(cur => cur.name === options.name);\r\n\r\n    localStorage.setItem('our_database', JSON.stringify(data));\r\n}\r\n\r\nfunction postVideo(options) {\r\n    // Fetching it first\r\n    let data = fetchDatabase();\r\n\r\n    console.log(options);\r\n\r\n    // console.log(options.completed);\r\n\r\n    const videoObj = {\r\n        position: options.position,\r\n        name: options.name,\r\n        completed: options.completed || false,\r\n        completion: options.completion || null,\r\n        duration: options.duration || null,\r\n        bookmarks: []\r\n    };\r\n\r\n    const curPath = data.find(cur => cur.root === options.root);\r\n\r\n    if(curPath) {\r\n        const curVideo = curPath.videos.find(cur => cur.name === options.name);\r\n\r\n        if(curVideo) {\r\n            return;\r\n        }\r\n    }\r\n\r\n    curPath.videos.push(videoObj);\r\n    \r\n    localStorage.setItem('our_database', JSON.stringify(data));\r\n}\r\n\r\nfunction updateVideo(options) {\r\n    // Fetching it first\r\n    let data = fetchDatabase();\r\n\r\n    let curPath = data.find(cur => cur.root === options.root);\r\n\r\n    if(options.mainRoot && !curPath) {\r\n        curPath = data.find(cur => cur.root === options.mainRoot);\r\n        curPath = curPath.subDir.find(cur => cur.root === options.root);\r\n    }\r\n\r\n    if(curPath) {\r\n        const curPathVideos = curPath.videos.map(cur => {\r\n            if(cur.name === options.name) {\r\n                let bookMarks = [...cur.bookmarks];\r\n                if(options.bookmarks) {\r\n                    bookMarks.push(options.bookmarks);\r\n                }\r\n                return {\r\n                    position: options.position || cur.position,\r\n                    name: options.name || cur.name,\r\n                    completed: options.completed || cur.completed || false,\r\n                    completion: options.completion || cur.completion || null,\r\n                    duration: options.duration || cur.duration || null,\r\n                    bookmarks: bookMarks || []\r\n                }\r\n            }\r\n            return cur;\r\n        });\r\n\r\n        curPath.videos = curPathVideos;\r\n        \r\n        localStorage.setItem('our_database', JSON.stringify(data));\r\n    }\r\n}\r\n\r\nfunction getVideoDetails(options, cb) {\r\n    // Fetching it first\r\n    let data = fetchDatabase();\r\n\r\n    if(!data) return;\r\n\r\n    const curPath = data.find(cur => cur.root === options.root);\r\n\r\n    if(curPath) {\r\n        const curVideo = curPath.videos.find(cur => cur.name === options.name);\r\n\r\n        if(!curVideo) {\r\n            cb(options);\r\n        }\r\n\r\n        return curVideo;\r\n    }\r\n}\r\n\r\nfunction updateRoot(options) {\r\n    // Fetching it first\r\n    let data = fetchDatabase();\r\n\r\n    let curPath = data.find(cur => cur.root === options.root);\r\n\r\n    if(options.mainRoot && !curPath) {\r\n        curPath = data.find(cur => cur.root === options.mainRoot);\r\n        curPath = curPath.subDir.find(cur => cur.root === options.root);\r\n    }\r\n\r\n    curPath.lastPlayed = options;\r\n    localStorage.setItem('our_database', JSON.stringify(data));\r\n}\r\n\r\nfunction fetchDatabase() {\r\n    let data = localStorage.getItem('our_database');\r\n\r\n    if(!data) {\r\n        localStorage.setItem('our_database', JSON.stringify([]));\r\n\r\n        data = localStorage.getItem('our_database');\r\n    }\r\n\r\n    return JSON.parse(data);\r\n}\r\n\r\nfunction fetchVideo(videoObj) {\r\n    // Fetching it first\r\n    let data = fetchDatabase();\r\n    if(!data) return;\r\n\r\n    let curPath = data.find(cur => cur.root === videoObj.root);\r\n\r\n    if(videoObj.mainRoot && !curPath) {\r\n        curPath = data.find(cur => cur.root === videoObj.mainRoot);\r\n        curPath = curPath.subDir.find(cur => cur.root === videoObj.root);\r\n    }\r\n\r\n    // console.log(curPath);\r\n\r\n\r\n    const curVideo = curPath.videos.find(cur => cur.name === videoObj.name);\r\n\r\n    return curVideo;\r\n}\r\n\r\n\r\nmodule.exports = {\r\n    postRootPath,\r\n    postVideo,\r\n    updateVideo,\r\n    getVideoDetails,\r\n    updateRoot,\r\n    fetchDatabase,\r\n    fetchVideo,\r\n}\n\n//# sourceURL=webpack:///./public/assets/js/db.js?");

/***/ }),

/***/ "./public/assets/js/message.js":
/*!*************************************!*\
  !*** ./public/assets/js/message.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fetchedData = document.querySelector('.fetched-data').innerText;\r\n\r\nconst parsedData = JSON.parse(fetchedData);\r\n\r\nconst db = __webpack_require__(/*! ./db */ \"./public/assets/js/db.js\");\r\n\r\nconst dbData = db.fetchDatabase();\r\n\r\nconst curRoot = dbData.find(cur => cur.root === parsedData.root);\r\n\r\n\r\nif(!curRoot) {\r\n    dbData.push(parsedData);\r\n    localStorage.setItem('our_database', JSON.stringify(dbData));\r\n}\r\n\n\n//# sourceURL=webpack:///./public/assets/js/message.js?");

/***/ }),

/***/ "./public/assets/js/utils/utilities.js":
/*!*********************************************!*\
  !*** ./public/assets/js/utils/utilities.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\r\n\r\nfunction sortVideoList(videoArr) {\r\n    function fnStr(str1) {\r\n        const arr = [];\r\n        for(let i = 0; i < str1.length; i++) {\r\n            if(!isNaN(str1[i]) && str1[i] !== ' ') {\r\n                arr.push(+str1[i]);\r\n            } else {\r\n                break;\r\n            }\r\n        }\r\n        \r\n        return +arr.join('');\r\n    }\r\n    \r\n    return videoArr.sort((a,b)=>fnStr(a.name)-fnStr(b.name));\r\n}\r\n\r\nfunction timeStampConv(timeStamp) {\r\n    let minutes = parseInt(timeStamp / 60);\r\n    let seconds = parseInt(timeStamp % 60);\r\n\r\n    if(minutes.toString().length === 1) {\r\n        minutes = `0${minutes.toString()}`\r\n    }\r\n\r\n    if(seconds.toString().length === 1) {\r\n        seconds = `0${seconds.toString()}`\r\n    }\r\n\r\n    return `${minutes}:${seconds}`;\r\n}\r\n\r\nmodule.exports = {\r\n    sortVideoList,\r\n    timeStampConv\r\n}\n\n//# sourceURL=webpack:///./public/assets/js/utils/utilities.js?");

/***/ })

/******/ });