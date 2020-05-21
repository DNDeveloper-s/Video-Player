const Base64 = require('./utils/Base64');
const dragNDrop = require('./dragNDrop');
const db = require('./db');
const utils = require('./utils/utilities');
const ContextMenu = require('./ContextMenu');
const bookmark = require('./bookmark');

/**
 * 
 * @param {Object} options 
 * 
 * options = {
 *      root: String
 *      mainRoot?: String
 * }
 */

function init(mainProps) {

    console.log(mainProps);

    window.currentPath = mainProps.root;
    console.log(mainProps.root);

    // if(mainProps.mainRoot) {
    //     window.currentPath = mainProps.mainRoot;
    // }

    const videos = document.querySelectorAll('.video-link');
    const videoContainer = document.querySelector('.video');
    
    async function getDuration(options) {
        const curVideo = db.fetchVideo({
            root: options.root,
            mainRoot: mainProps.mainRoot || null,
            name: options.name
        }) 
        
        if(!curVideo.duration) {
            const decodedVideo = Base64.encode(options.name);
            const decodedPath = Base64.encode(currentPath);

            const res = await fetch(`${window.location.origin}/getDuration?decodedVideo=${decodedVideo}&currentPath="${decodedPath}"`)
            const data = await res.json();

            if(data.acknowledgement.type === 'success') {
                // Showing Duration Element on video link
                const videoLinkEl = document.querySelector(`.video-link[title="${options.name}"]`);
                videoLinkEl.querySelector('.duration').innerHTML = utils.timeStampConv(data.acknowledgement.duration);

                db.updateVideo({
                    root: options.root,
                    mainRoot: mainProps.mainRoot || null,
                    name: options.name,
                    duration: data.acknowledgement.duration
                })
            }
        }

        // videoEl.setAttribute('src', `${window.location.origin}/load?decodedVideo=${decodedVideo}&currentPath="${decodedPath}"`);
        // videoEl.setAttribute('type', 'video/mp4');

        // videoEl.onloadedmetadata = function(e) {
        //     const duration = videoEl.duration;

        

        //     db.updateVideo({
        //         root: options.root,
        //         mainRoot: mainProps.mainRoot || null,
        //         name: options.name,
        //         duration: duration
        //     })

        // }
    }

    let vidLen = videos.length;
    // if(videos.length > 50) {
    //     vidLen = 50; 
    // }
    
    
    const videosArr = [];

    for(let i = 1; i <= vidLen; i++) {
        const video = document.querySelector(`.video-link[data-position="${i}"]`);
        videosArr.push(video);
    }


    for(let i = 1; i <= vidLen; i++) {
        const video = videosArr[i-1];
        if(!video) break;
         const videoObj = {
            root: currentPath,
            position: video.dataset.position,
            name: video.querySelector('.name').innerText
        };

        loadVideo(videoObj);

        // Post Video to Database
        // const videoDetails = db.getVideoDetails(videoObj, function() {
        //     console.log(videoObj);
        //     db.postVideo(videoObj);
        // });


        getDuration(videoObj);


        const menu = new ContextMenu(`.video-link[data-position="${i}"]`);
        menu.init();

        video.addEventListener('mouseup', function(e) {
            if(e.button !== 0) return;
            const curVideoEl = document.querySelector(`video[data-videoname="${this.querySelector('.name').innerText}"]`);

            if(!curVideoEl) {
                playVideo({
                    root: currentPath,
                    mainRoot: mainProps.mainRoot || null,
                    position: this.dataset.position,
                    name: this.querySelector('.name').innerText
                });
            }
        })

        video.querySelector('.checkbox').addEventListener('mouseup', function(e) {
            if(e.button !== 0) return;
            const videoObj = {
                root: currentPath,
                mainRoot: mainProps.mainRoot || null,
                name: video.querySelector('.name').innerText
            }
            toggleVideoCompletion(this, videoObj);
        })
    }

    function toggleVideoCompletion(thisEl, videoObj) {
        const curVideo = db.fetchVideo(videoObj);
        const isVideoCompleted = curVideo.completed;
        
        console.log(curVideo);
        
        if(isVideoCompleted) {
            db.updateVideo({
                ...videoObj,
                completed: false
            })
            thisEl.classList.remove('completed');
        } else {
            db.updateVideo({
                ...videoObj,
                completed: true
            })
            thisEl.classList.add('completed');
        }
    }

    init();

    

    function loadVideo(options) {
        // Fetching it first
        let data = db.fetchDatabase();

        if(!data) return;

        let curPath = data.find(cur => cur.root === options.root);

        if(mainProps.mainRoot && !curPath) {
            curPath = data.find(cur => cur.root === mainProps.mainRoot);
            
            curPath = curPath.subDir.find(cur => cur.root === mainProps.root);
        }

        if(curPath) {
            const curVideo = curPath.videos.find(cur => cur.name === options.name);

            // console.log(curVideo.name, options.name, curVideo.position);
            
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

        // db.postRootPath({
        //     root: currentPath
        // });

        const data = db.fetchDatabase();

        let curPath = data.find(cur => cur.root === mainProps.root);

        if(mainProps.mainRoot && !curPath) {
            curPath = data.find(cur => cur.root === mainProps.mainRoot);
            
            curPath = curPath.subDir.find(cur => cur.root === mainProps.root);
        }

        // const curPath = rootData;
        let InCompletedVideo = curPath.lastPlayed;

        // console.log(InCompletedVideo);
        if(!InCompletedVideo) {
            InCompletedVideo = curPath.videos.filter(cur => cur.completed === false)[0];
        }

        bookmark.initBookMarkFilterHandler({
            root: currentPath,
            mainRoot: mainProps.mainRoot || null
        });

        // console.log(InCompletedVideo);

        // Playing video
        if(InCompletedVideo) {
            playVideo({
                position: InCompletedVideo.position,
                root: mainProps.root,
                name: InCompletedVideo.name,
                mainRoot: mainProps.mainRoot || null
            });
        }

        const list = new dragNDrop('.list');
        list.init();
    }

    

    // function updatePosition() {
    //     for(let i = 1; i <= vidLen; i++) {
    //         const updatedOne = document.querySelector(`.video-link[data-position="${i}"]`);

    //         const position = +updatedOne.dataset.position;
    //         const basePosition = +updatedOne.dataset.baseposition;

    //         if(position !== basePosition) {
    //             const videoEl = document.querySelector(`.video-link[data-baseposition="${basePosition}"]`);
    //             db.updateVideo({
    //                 root: currentPath,
    //                 name: videoEl.querySelector('.name').innerText,
    //                 position: videoEl.dataset.position
    //             })
    //         }
    //     }
    // }
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

function playVideo(videoObj) {
    const videoContainer = document.querySelector('.video');

    const curVideoEl = document.querySelector(`.video > video[data-videoname="${videoObj.name}"]`);
    
    if(curVideoEl && videoObj.currentTime) {
        curVideoEl.currentTime = videoObj.currentTime;
        return;
    }

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
    const decodedPath = Base64.encode(currentPath);
    
    videoContainer.innerHTML = `<video data-videoname="${videoObj.name}" data-videoposition="${videoLink.dataset.position}" src="${window.location.origin}/load?decodedVideo=${decodedVideo}&currentPath=${decodedPath}" controls autoplay muted></video>`
    // videoContainer.innerHTML = `<video src="" controls muted></video>`
    
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

    
    videoEl.addEventListener('mousemove', function(e) {
        const bookMarks = document.querySelectorAll('.video-timeline > .bookmark');
        bookMarks.forEach(bookMark => {
            bookMark.classList.remove('hide');
        })
    });

    videoEl.onloadedmetadata = async function() {
        videoEl.currentTime = +videoLink.dataset.completion || 0;

        const videoCompletion = (videoEl.currentTime / videoEl.duration * 100).toFixed(2);

        if(videoCompletion > 99) {
            videoEl.currentTime = 0;
        }

        if(videoObj.currentTime) {
            videoEl.currentTime = +videoObj.currentTime;
        }

        // await videoEl.play();


        videoEl.addEventListener('keydown', async function(e) {
            const videoCompletion = (videoEl.currentTime / videoEl.duration * 100).toFixed(2);
            
            if (event.ctrlKey && event.key === 'b') {
                videoEl.pause();
                setTimeout(() => {
                    showBookMarkAddOption(videoCompletion, {
                        timeStamp: videoEl.currentTime,
                        name: videoObj.name,
                        root: videoObj.root,
                        mainRoot: videoObj.mainRoot || null
                    });
                }, 100);
            }

            if (event.ctrlKey && event.key === ']') {
                videoEl.playbackRate = videoEl.playbackRate + 0.5;
                showVideoUpdate(videoEl.playbackRate);
            }

            if (event.ctrlKey && event.key === '[') {
                videoEl.playbackRate = videoEl.playbackRate - 0.5;
                showVideoUpdate(videoEl.playbackRate);
            }
        })
    }


    videoEl.addEventListener('ended', function() {
        videoEnded(this, videoObj);
    });

    videoEl.addEventListener('timeupdate', function() {

        const videoCompletion = (videoEl.currentTime / videoEl.duration * 100).toFixed(2);

        videoLink.dataset.completion = videoEl.currentTime;

        db.updateVideo({
            root: videoObj.root,
            mainRoot: videoObj.mainRoot || null,
            name: videoObj.name,
            completion: videoEl.currentTime
        })

        completionEl.style.width = `${videoCompletion}%`;

        removeBookMarkModal();
    })
}

function showVideoUpdate(message) {
    const videoHolderEl = document.querySelector('.video-holder');
    const videoUpdateEl = videoHolderEl.querySelector('.video-update');

    if(videoUpdateEl) {
        removeVideoUpdate();
    }

    const htmlToAdd = `
        <div class="video-update">
            ${message}
        </div>
    `;
    videoHolderEl.insertAdjacentHTML('afterbegin', htmlToAdd);

    let timeout = setTimeout(() => {
        removeVideoUpdate();
        clearTimeout(timeout);
    }, 3000);

}

function removeVideoUpdate() {
    const videoHolderEl = document.querySelector('.video-holder');
    const videoUpdateEl = videoHolderEl.querySelector('.video-update');

    if(videoUpdateEl) {
        videoUpdateEl.remove();
    }
}

function videoEnded(thisEl, videoObj) {
    const position = thisEl.dataset.videoposition;
    const videoLink = document.querySelector(`.video-link[data-position="${position}"]`);

    videoLink.querySelector('.checkbox').classList.add('completed');

    db.updateVideo({
        completed: true,
        root: videoObj.root,
        mainRoot: videoObj.mainRoot || null,
        name: document.querySelector(`.video-link[data-position="${position}"]`).querySelector('.name').innerText
    });

    
    playVideo({
        position: +position + 1,
        root: videoObj.root,
        mainRoot: videoObj.mainRoot || null,
        name: document.querySelector(`.video-link[data-position="${+position + 1}"]`).querySelector('.name').innerText
    });
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

module.exports = {
    removeBookMarkModal,
    init,
    playVideo
}
