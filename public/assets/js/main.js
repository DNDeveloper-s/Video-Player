const Base64 = require('./utils/Base64');
const dragNDrop = require('./dragNDrop');
const db = require('./db');
const rootModule = require('./root');

rootModule.loadRoot();

const utils = require('./utils/utilities');

const videos = document.querySelectorAll('.video-link');
const videoContainer = document.querySelector('.video');

// window.currentPath = document.getElementById('currentPath').innerText;
// dropDown.initDropDown('.choose_dir_dropdown');
// dropDown.initDropDown('.choose_subdir_dropdown');

function getDuration(options) {
    const videoEl = document.createElement('video');
    
    const decodedVideo = Base64.encode(options.name);

    videoEl.setAttribute('src', `${window.location.origin}/load?decodedVideo=${decodedVideo}`);
    videoEl.setAttribute('type', 'video/mp4');

    videoEl.onloadedmetadata = function(e) {
        const duration = videoEl.duration;

        db.updateVideo({
            root: options.root,
            name: options.name,
            duration: duration
        })

    }
}

(async function() {
    const res = await fetch(`${window.location.origin}/getDir`);

    const data = await res.json();

    console.log(data);
})();

let vidLen = videos.length;
if(videos.length > 50) {
    vidLen = 50; 
}


const videosArr = [];

// for(let i = 1; i <= vidLen; i++) {
//     const video = document.querySelector(`.video-link[data-position="${i}"]`);
//     videosArr.push(video);
// }

// for(let i = 1; i <= vidLen; i++) {
//     const video = videosArr[i-1];
    
//     const videoObj = {
//         root: currentPath,
//         position: video.dataset.position,
//         name: video.querySelector('.name').innerText
//     };

//     loadVideo(videoObj);

//     // Post Video to Database
//     const videoDetails = db.getVideoDetails(videoObj, function() {
//         db.postVideo(videoObj);
//     });

//     // init();

//     getDuration(videoObj);

//     video.addEventListener('click', function(e) {
//         playVideo({
//             root: currentPath,
//             position: this.dataset.position,
//             name: this.querySelector('.name').innerText
//         });
//     })
// }

// init();

const our_database = [
    {
        path: '/',
        lastPlayed: 'videoObj',
        videos: [
            {   // videoObj
                position: 1,
                name: 'My Video',
                completion: 600,
                duration: 3500
            }
        ]
    }
]

function loadVideo(options) {
    // Fetching it first
    let data = db.fetchDatabase();

    if(!data) return;

    const curPath = data.find(cur => cur.root === options.root);

    if(curPath) {
        const curVideo = curPath.videos.find(cur => cur.name === options.name);
        
        if(curVideo) {
            const videoEl = document.querySelector(`.video-link[title="${curVideo.name}"]`);

            
            const completionEl = videoEl.querySelector('.completion-range');
            const videoCompletion = (curVideo.completion / curVideo.duration * 100).toFixed(2);
            videoEl.dataset.completion = curVideo.completion;
            completionEl.style.width = `${videoCompletion}%`;
            videoEl.dataset.baseposition = curVideo.position;
            
            videoEl.dataset.position = curVideo.position;

            if(curVideo.completed) {
                videoEl.querySelector('.checkbox').classList.add('completed');
            }
        }
    }
}


function videoEnded() {
    const position = this.dataset.videoposition;
    const videoLink = document.querySelector(`.video-link[data-position="${position}"]`);

    videoLink.querySelector('.checkbox').classList.add('completed');

    db.updateVideo({
        completed: true,
        root: currentPath,
        name: document.querySelector(`.video-link[data-position="${position}"]`).querySelector('.name').innerText
    });

    // console.log({
    //     position: +position,
    //     completed: true,
    //     root: currentPath,
    //     name: document.querySelector(`.video-link[data-position="${position}"]`).querySelector('.name').innerText
    // });
    
    playVideo({
        position: +position + 1,
        root: currentPath,
        name: document.querySelector(`.video-link[data-position="${+position + 1}"]`).querySelector('.name').innerText
    });
}

function playVideo(videoObj) {
    // Updating PlayVideo
    // console.log(videoObj);
    db.updateRoot(videoObj);

    // Updating Video Title
    const videoTitleHolder = document.querySelector('.video-title');
    videoTitleHolder.innerHTML = videoObj.name;

    // console.log(videoObj.position);
    const videoLink = document.querySelector(`.video-link[title="${videoObj.name}"]`);

    const completionEl = videoLink.querySelector('.completion-range');

    const links = videoLink.parentElement.querySelectorAll('.video-link');
    links.forEach(link => {
        link.classList.remove('active');
    })

    videoLink.classList.add('active');

    const decodedVideo = Base64.encode(videoLink.querySelector('.name').innerText);
    videoContainer.innerHTML = `<video src="${window.location.origin}/load?decodedVideo=${decodedVideo}" controls muted></video>`
    
    const videoEl = document.querySelector(`video`);

    const bookMarks = document.querySelectorAll('.video-timeline > .bookmark');
    setTimeout(() => {
        bookMarks.forEach(bookMark => {
            bookMark.classList.add('hide');
        })
    }, 900)
    
    videoEl.addEventListener('mousestop', function(e) {
        const bookMarks = document.querySelectorAll('.video-timeline > .bookmark');
        bookMarks.forEach(bookMark => {
            bookMark.classList.add('hide');
        })
    });

    const bookmark = require('./bookmark');
    bookmark.showThisVideoBookMarks(videoObj);

    // videoEl.addEventListener('mouseleave', function(e) {
    //     const bookMarks = document.querySelectorAll('.video-timeline > .bookmark');
    //     bookMarks.forEach(bookMark => {
    //         bookMark.classList.add('hide');
    //     })
    // });
    
    videoEl.addEventListener('mousemove', function(e) {
        const bookMarks = document.querySelectorAll('.video-timeline > .bookmark');
        bookMarks.forEach(bookMark => {
            bookMark.classList.remove('hide');
        })
    });

    videoEl.onloadedmetadata = function() {
        videoEl.currentTime = +videoLink.dataset.completion || 0;
        // videoEl.play();

        if(videoObj.currentTime) {
            videoEl.currentTime = +videoObj.currentTime;
        }


        videoEl.addEventListener('keydown', async function(e) {
            const videoCompletion = (videoEl.currentTime / videoEl.duration * 100).toFixed(2);
            
            if (event.ctrlKey && event.key === 'b') {
                videoEl.pause();
                setTimeout(() => {
                    showBookMarkAddOption(videoCompletion, {
                        timeStamp: videoEl.currentTime,
                        name: videoObj.name,
                        root: videoObj.root
                    });
                }, 100);
            }
        })
    }


    videoEl.addEventListener('ended', videoEnded);

    videoEl.addEventListener('timeupdate', function() {

        const videoCompletion = (videoEl.currentTime / videoEl.duration * 100).toFixed(2);

        videoLink.dataset.completion = videoEl.currentTime;

        db.updateVideo({
            root: videoObj.root,
            name: videoObj.name,
            completion: videoEl.currentTime
        })

        completionEl.style.width = `${videoCompletion}%`;

        removeBookMarkModal();
    })
}

async function removeBookMarkModal() {
    const videoTimeLine = document.querySelector('.video-timeline');
    let bookMarkModal = videoTimeLine.querySelector('.add_bookmark_option');

    if(!bookMarkModal) return false;

    bookMarkModal.classList.add('hide');

    await new Promise((res, rej) => {
        setTimeout(() => {
            bookMarkModal.remove();
            res();
        }, 250);
    })

    return true;
}

async function showBookMarkAddOption(videoCompletion, videoObj) {
    const videoTimeLine = document.querySelector('.video-timeline');
    let bookMarkModal = videoTimeLine.querySelector('.add_bookmark_option');

    if(bookMarkModal) {
        await removeBookMarkModal();
    }
    
    const htmlToAdd = `
        <div class="add_bookmark_option">
            <div class="label">
                <label for="">Add Bookmark</label>
            </div>
            <div class="input">
                <input tabindex="0" id="bookmark_input" class="bookmark_input" type="text" placeholder="Enter Bookmark...">
            </div>
            <div class="notice">
                <p><span>Note:</span> Hit Enter to add the bookmark.</p>
            </div>
        </div>
    `;
    videoTimeLine.insertAdjacentHTML('beforeend', htmlToAdd);

    bookMarkModal = videoTimeLine.querySelector('.add_bookmark_option');

    setTimeout(() => {
        const bookmarkInput = document.getElementById('bookmark_input');
        bookmarkInput.focus();
    }, 100);

    // Init BookMark Input Handler
    const bookmark = require('./bookmark');
    bookmark.initBookMarkInputHandler(videoObj);

    if(videoCompletion < 20) {
        bookMarkModal.style.left = `${0}%`;
    } else
    if(videoCompletion > 90) {
        bookMarkModal.style.left = `auto`;
        bookMarkModal.style.right = `${0}%`;
    } else {
        bookMarkModal.style.left = `${videoCompletion}%`;
        bookMarkModal.style.transform = `translateX(-50%)`;
    }


}

(function (mouseStopDelay) {
    var timeout;
    document.addEventListener('mousemove', function (e) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            var event = new CustomEvent("mousestop", {
                detail: {
                    clientX: e.clientX,
                    clientY: e.clientY
                },
                bubbles: true,
                cancelable: true
            });
            e.target.dispatchEvent(event);
        }, mouseStopDelay);
    });
}(2600));

function init() {

    db.postRootPath({
        root: currentPath
    });

    window.addEventListener('keydown', async function(e) {
        if(e.key === 'Escape') {
            const removed = await removeBookMarkModal();
            
            if(removed) {
                const videoEl = document.querySelector(`video`);
                videoEl.play();
            }
        }
    })

    window.addEventListener('click', outOfBookMarkModal);

    function outOfBookMarkModal(e) {
        const videoTimeLine = document.querySelector('.video-timeline');
        if(videoTimeLine) {
            let bookMarkModal = videoTimeLine.querySelector('.add_bookmark_option');
            if(bookMarkModal) {
                if(!e.path.includes(bookMarkModal)) {
                    removeBookMarkModal();
                }
            }
        }
    }

    const data = db.fetchDatabase();

    const curRoot = data.find(cur => cur.root === currentPath);
    let InCompletedVideo = curRoot.lastPlayed;

    // console.log(InCompletedVideo);
    if(!InCompletedVideo) {
        InCompletedVideo = curRoot.videos.filter(cur => cur.completed === false)[0];
    }

    // console.log(InCompletedVideo);

    // Playing video
    playVideo({
        position: InCompletedVideo.position,
        root: currentPath,
        name: InCompletedVideo.name
    });

    const list = new dragNDrop('.list');
    list.init();
}

function updatePosition() {
    for(let i = 1; i <= vidLen; i++) {
        const updatedOne = document.querySelector(`.video-link[data-position="${i}"]`);

        const position = +updatedOne.dataset.position;
        const basePosition = +updatedOne.dataset.baseposition;

        if(position !== basePosition) {
            const videoEl = document.querySelector(`.video-link[data-baseposition="${basePosition}"]`);
            db.updateVideo({
                root: currentPath,
                name: videoEl.querySelector('.name').innerText,
                position: videoEl.dataset.position
            })
        }
    }
}

// document.getElementById('save').onclick = updatePosition;

module.exports = {
    playVideo
}