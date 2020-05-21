const utils = require('./utils/utilities');
const db = require('./db');

function addBookMark(options) {
    /**
     * 
     * options = {
     *      timeStamp: Time
     *      description: 'String'
     *      root: RootPath 'String'
     *      name: Video Name 'String'
     * }
     * 
     */

    console.log(options);
    
    // const {updateVideo} = require('./main');

    db.updateVideo({
        name: options.name,
        root: options.root,
        mainRoot: options.mainRoot || null,
        bookmarks: {
            timeStamp: options.timeStamp,
            description: options.description
        }
    })

    showBookMark({
        name: options.name,
        root: options.root,
        mainRoot: options.mainRoot || null,
        timeStamp: options.timeStamp,
        description: options.description
    });
    
}

function showBookMark(options) {
    const bookMarkListContainer = document.getElementById('bookmark_list');

    let mainRoot = null;

    if(options.mainRoot) {
        mainRoot = `data-mainRoot="${options.mainRoot}"`;
    }
    
    const htmlToAdd = `
        <div ${mainRoot} data-root="${options.root}" class="bookmark" data-video-title="${options.name}" data-timestamp="${options.timeStamp}">
            <div class="description">
                ${options.description}
            </div>
            <div class="time_stamp">
                ${utils.timeStampConv(options.timeStamp)}
            </div>
        </div>
    `;

    bookMarkListContainer.insertAdjacentHTML('beforeend', htmlToAdd);
    initBookMarksEvents();
}

function initBookMarksEvents() {
    const bookMarkListContainer = document.getElementById('bookmark_list');
    const bookmarks = bookMarkListContainer.querySelectorAll('.bookmark');

    const setupVideos = require('./setupVideos');

    bookmarks.forEach(bookmark => {
        if(!bookmark.dataset.clickEvent || !bookmark.dataset.clickEvent === 'true') {
            bookmark.dataset.clickEvent = true;
            bookmark.addEventListener('click', function() {
                // const {playVideo} = require('./main');
                setupVideos.playVideo({
                    name: bookmark.dataset.videoTitle,
                    root: window.currentPath,
                    mainRoot: bookmark.dataset.mainRoot || null,
                    currentTime: bookmark.dataset.timestamp
                });
            })
        }
    })
}

function initBookMarkInputHandler(videoObj) {
    const videoTimeLine = document.querySelector('.video-timeline');
    const bookMarkModal = videoTimeLine.querySelector('.add_bookmark_option');
    const bookmarkInput = bookMarkModal.querySelector('.bookmark_input');
    bookmarkInput.focus();
    bookmarkInput.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            addBookMark({
                ...videoObj,
                description: this.value
            });
        }
    });
}

function initBookMarkFilterHandler(videoObj) {
    const filterBookMark = document.querySelector('.bookmarks-filter > select');

    filterBookMark.addEventListener('change', function() {
        const opt = getSelectedOption(filterBookMark);
        if(opt.value === 'This Root') {
            console.log(opt.value);
            showAllBookMarks(videoObj);
        } else if(opt.value === 'This Video') {
            const curVideoName = document.querySelector('video').dataset.videoname;
            showThisVideoBookMark({
                ...videoObj,
                name: curVideoName
            })
        }
    })
}

function showThisVideoBookMark(videoObj) {
    const curVideo = db.fetchVideo(videoObj);
    const bookMarkListContainer = document.getElementById('bookmark_list');

    let mainRoot = null;
    if(videoObj.mainRoot) {
        mainRoot = `data-mainRoot="${videoObj.mainRoot}"`;
    }
    bookMarkListContainer.innerHTML = '';
    curVideo.bookmarks.forEach(bookmark => {
        const htmlToAdd = getBookMarkHTMLByBookMarkObject(bookmark, curVideo, mainRoot);

        bookMarkListContainer.insertAdjacentHTML('beforeend', htmlToAdd);
        initBookMarksEvents();
    });
}

function showAllBookMarks(videoObj) {
    const data = db.fetchDatabase();

    if(!data) throw new Error('No Database Found!');

    let curPath = data.find(cur => cur.root === videoObj.root);
    
    if(videoObj.mainRoot && !curPath) {
        curPath = data.find(cur => cur.root === videoObj.mainRoot);
        curPath = curPath.subDir.find(cur => cur.root === videoObj.root);
    }

    const bookMarksList = document.getElementById('bookmark_list');
    bookMarksList.innerHTML = '';
    curPath.videos.forEach(video => {
        if(video.bookmarks.length > 0) {
            const structureHtml = `
                <div class="category-separator" data-videoname="${video.name}">
                    <div class="video-name">${video.name}</div>
                </div>
            `;
            bookMarksList.insertAdjacentHTML('beforeend', structureHtml);

            video.bookmarks.forEach((bookmark) => {

                let mainRoot = null;
            
                if(videoObj.mainRoot) {
                    mainRoot = `data-mainRoot="${videoObj.mainRoot}"`;
                }
                
                const htmlToAdd = getBookMarkHTMLByBookMarkObject(bookmark, video, mainRoot);

                const categorySeparatorEl = bookMarksList.querySelector(`.category-separator[data-videoname="${video.name}"]`);
                categorySeparatorEl.insertAdjacentHTML('beforeend', htmlToAdd);

            })
        }
    })

}

function getBookMarkHTMLByBookMarkObject(bookmark, video, mainRoot) {
    return `
        <div ${mainRoot} data-root="${video.root}" class="bookmark" data-video-title="${video.name}" data-timestamp="${bookmark.timeStamp}">
            <div class="description">
                ${bookmark.description}
            </div>
            <div class="time_stamp">
                ${utils.timeStampConv(bookmark.timeStamp)}
            </div>
        </div>
    `;
}

function showThisVideoBookMarks(videoObj) {
    const curVideo = db.fetchVideo(videoObj);
    const bookMarkListContainer = document.getElementById('bookmark_list');
    bookMarkListContainer.innerHTML = '';
    curVideo.bookmarks.forEach(bookmark => {
        showBookMark({
            name: curVideo.name,
            root: videoObj.root,
            ...bookmark
        });
    })
}

function getSelectedOption(sel) {
    var opt;
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
            break;
        }
    }
    return opt;
}

module.exports = {
    initBookMarkInputHandler,
    showThisVideoBookMarks,
    initBookMarkFilterHandler
}