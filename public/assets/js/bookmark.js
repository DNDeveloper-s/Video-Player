const utils = require('./utils/utilities');

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
    
    const {updateVideo} = require('./main');

    updateVideo({
        name: options.name,
        root: options.root,
        bookmarks: {
            timeStamp: options.timeStamp,
            description: options.description
        }
    })

    showBookMark({
        name: options.name,
        root: options.root,
        timeStamp: options.timeStamp,
        description: options.description
    });
    
}

function showBookMark(options) {
    const bookMarkListContainer = document.getElementById('bookmark_list');

    const htmlToAdd = `
        <div class="bookmark" data-video-title="${options.name}" data-timestamp="${options.timeStamp}">
            <div class="description">
                ${options.description}
            </div>
            <div class="time_stamp">
                ${timeStampConv(options.timeStamp)}
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
                const {playVideo} = require('./main');
                playVideo({
                    name: bookmark.dataset.videoTitle,
                    root: window.currentPath,
                    currentTime: bookmark.dataset.timestamp
                });
            })
        }
    })
}

function timeStampConv(timeStamp) {
    return `${parseInt(timeStamp / 60)}:${parseInt(timeStamp % 60)}`;
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
    const curVideo = utils.fetchVideo(videoObj);
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