

function sortVideoList(videoArr) {
    function fnStr(str1) {
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
    
    return videoArr.sort((a,b)=>fnStr(a.name)-fnStr(b.name));
}


module.exports = {
    sortVideoList
}