const Base64 = require('./utils/Base64');
const dragNDrop = require('./dragNDrop');
const db = require('./db');
const rootModule = require('./root');
const setupVideos = require('./setupVideos');

rootModule.loadRoot();

const utils = require('./utils/utilities');


// (async function() {
//     const res = await fetch(`${window.location.origin}/getDir`);

//     const data = await res.json();

//     console.log(data);
// })();



window.addEventListener('keydown', async function(e) {
    if(e.key === 'Escape') {
        const removed = await setupVideos.removeBookMarkModal();
        
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
                setupVideos.removeBookMarkModal();
            }
        }
    }
}

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

// document.getElementById('save').onclick = updatePosition;
