const utils = require('./utils/utilities');

function postRootPath(options) {
    // Fetching it first
    let data = fetchDatabase();

    if(!data) {
        data = [];
    }

    const rootObj = {
        root: options.root,
        lastPlayed: false,
        videos: []
    }

    const curPath = data.find(cur => cur.root === options.root);

    if(!curPath) {
        data.push(rootObj);
    }
    // const curVideo = curPath.videos.find(cur => cur.name === options.name);

    localStorage.setItem('our_database', JSON.stringify(data));
}

function postVideo(options) {
    // Fetching it first
    let data = fetchDatabase();

    console.log(options);

    // console.log(options.completed);

    const videoObj = {
        position: options.position,
        name: options.name,
        completed: options.completed || false,
        completion: options.completion || null,
        duration: options.duration || null,
        bookmarks: []
    };

    const curPath = data.find(cur => cur.root === options.root);

    if(curPath) {
        const curVideo = curPath.videos.find(cur => cur.name === options.name);

        if(curVideo) {
            return;
        }
    }

    curPath.videos.push(videoObj);
    
    localStorage.setItem('our_database', JSON.stringify(data));
}

function updateVideo(options) {
    // Fetching it first
    let data = fetchDatabase();

    let curPath = data.find(cur => cur.root === options.root);

    if(options.mainRoot && !curPath) {
        curPath = data.find(cur => cur.root === options.mainRoot);
        curPath = curPath.subDir.find(cur => cur.root === options.root);
    }

    if(curPath) {
        const curPathVideos = curPath.videos.map(cur => {
            if(cur.name === options.name) {
                let bookMarks = [...cur.bookmarks];
                if(options.bookmarks) {
                    bookMarks.push(options.bookmarks);
                }
                return {
                    position: options.position || cur.position,
                    name: options.name || cur.name,
                    completed: options.completed || cur.completed || false,
                    completion: options.completion || cur.completion || null,
                    duration: options.duration || cur.duration || null,
                    bookmarks: bookMarks || []
                }
            }
            return cur;
        });

        curPath.videos = curPathVideos;
        
        localStorage.setItem('our_database', JSON.stringify(data));
    }
}

function getVideoDetails(options, cb) {
    // Fetching it first
    let data = fetchDatabase();

    if(!data) return;

    const curPath = data.find(cur => cur.root === options.root);

    if(curPath) {
        const curVideo = curPath.videos.find(cur => cur.name === options.name);

        if(!curVideo) {
            cb(options);
        }

        return curVideo;
    }
}

function updateRoot(options) {
    // Fetching it first
    let data = fetchDatabase();

    let curPath = data.find(cur => cur.root === options.root);

    if(options.mainRoot && !curPath) {
        curPath = data.find(cur => cur.root === options.mainRoot);
        curPath = curPath.subDir.find(cur => cur.root === options.root);
    }

    curPath.lastPlayed = options;
    localStorage.setItem('our_database', JSON.stringify(data));
}

function fetchDatabase() {
    let data = localStorage.getItem('our_database');

    if(!data) {
        localStorage.setItem('our_database', JSON.stringify([]));

        data = localStorage.getItem('our_database');
    }

    return JSON.parse(data);
}

function fetchVideo(videoObj) {
    // Fetching it first
    let data = fetchDatabase();
    if(!data) return;

    let curPath = data.find(cur => cur.root === videoObj.root);

    if(videoObj.mainRoot && !curPath) {
        curPath = data.find(cur => cur.root === videoObj.mainRoot);
        curPath = curPath.subDir.find(cur => cur.root === videoObj.root);
    }

    // console.log(curPath);


    const curVideo = curPath.videos.find(cur => cur.name === videoObj.name);

    return curVideo;
}


module.exports = {
    postRootPath,
    postVideo,
    updateVideo,
    getVideoDetails,
    updateRoot,
    fetchDatabase,
    fetchVideo,
}