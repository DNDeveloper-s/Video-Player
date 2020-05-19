const utils = require('./utils/utilities');
const db = require('./db');
const setupVideos = require('./setupVideos');

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

module.exports = {
    initBookMarkInputHandler,
    showThisVideoBookMarks
}