

function sortVideoList(videoArr, debug) {
    function fnStr(str1) {
        const arr = [];
        for(let i = 0; i < str1.length; i++) {
            if(!isNaN(str1[i]) && str1[i] !== ' ') {
                arr.push(+str1[i]);
            } else {
                break;
            }
        }

        // if(debug) console.log(str1, arr, +arr.join(''));
        
        return +arr.join('');
    }

    const newVideoArr = videoArr.map(video => {
        const newName = makeNumberToStart(video.name);
        // console.log(newName);
        return {
            ...video,
            name: newName
        }
    });
    
    if(debug) console.log(newVideoArr.sort((a,b)=>fnStr(a.name)-fnStr(b.name)));

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

function timeStampConv(timeStamp) {
    let minutes = parseInt(timeStamp / 60);
    let seconds = parseInt(timeStamp % 60);

    if(!timeStamp) {
        return '';
    }

    if(minutes.toString().length === 1) {
        minutes = `0${minutes.toString()}`
    }

    if(seconds.toString().length === 1) {
        seconds = `0${seconds.toString()}`
    }

    return `${minutes}:${seconds}`;
}

module.exports = {
    sortVideoList,
    timeStampConv
}