const fs = require('fs');
const path = require('path');

function sortVideoList(videoArr) {
    function fnStr(str1) {
        console.log(str1);
        const arr = [];
        for(let i = 0; i < str1.length; i++) {
            if(!isNaN(str1[i]) && str1[i] !== ' ') {
                arr.push(+str1[i]);
            } else {
                break;
            }
        }
        
        return +arr.join('');
    }

    const newVideoArr = videoArr.map(video => {
        const newName = makeNumberToStart(video.name);
        
        fs.renameSync(path.join(video.path, video.name), path.join(video.path, newName))

        console.log(newName);
        return {
            ...video,
            name: newName
        }
    });
    
    return newVideoArr.sort((a,b)=>fnStr(a.name)-fnStr(b.name));
}

function makeNumberToStart(str) {
    let numberStarted = false;
    for(let i = 0; i < str.length; i++) {
      if(!isNaN(str[i]) && str[i] !== ' ' && !numberStarted) {
        numberStarted = true;
      }
      if(numberStarted) {
        str = str.slice(i);
        break;
      }
    }
    return str;
}

module.exports = {
    sortVideoList
}