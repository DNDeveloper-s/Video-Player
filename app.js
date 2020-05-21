const express = require('express');
const fs = require('fs');
const path = require('path');
const utils = require('./middleware/utils');
const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static');

// Importing Base64 encoding
const Base64 = require('./public/assets/js/utils/Base64');

// Initializing App of express
const app = express();

const getVideoDuration = require('node-video-duration');

// Setting default view engine 'ejs'
app.set('view engine', 'ejs');

// Command Line Arguments
const args = process.argv;

// PORT to be running on...
const PORT=8080; 

console.log(args);

// console.log(currentPath);

// Serving static files 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.get('/load', async (req, res, next) => {

    try {
        let decodedVideo = req.query.decodedVideo;
        let currentPath = req.query.currentPath;

        const video = Base64.decode(decodedVideo);
        const curPath = Base64.decode(currentPath);

        const localPath = path.join(curPath, video);
        const stat = fs.statSync(localPath);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] 
            ? parseInt(parts[1], 10)
            : fileSize-1
            const chunksize = (end-start)+1
            const file = fs.createReadStream(localPath, {start, end})
            const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(localPath).pipe(res)
        }
    } catch(e) {
        console.log(e);
    }

})



app.get('/getDir', async(req, res, next) => {
    const currentPath = args[2].slice(1, -1);
    const fileStructure = {
        root: currentPath,
        videos: [],
        subDir: [
    
        ]
    };

    await recursive(fileStructure, currentPath);

    // return res.json({
    //     files: fileStructure
    // })

    if(!fileStructure.subDir.length > 0) {
        fileStructure.videos = utils.sortVideoList(fileStructure.videos);

        fileStructure.videos = fileStructure.videos.map((cur, ind) => {
            return {
                ...cur,
                position: ind+1
            }
        })
    } else {
        fileStructure.subDir = fileStructure.subDir.map(subDir => {
            
            subDir.videos = utils.sortVideoList(subDir.videos);

            subDir.videos = subDir.videos.map((cur, ind) => {
                return {
                    ...cur,
                    position: ind+1
                }
            })

            return subDir;
        })
    }

    return res.render('message', {
        data: JSON.stringify(fileStructure)
    });
})

app.get('/getDuration', async (req, res, next) => {

    let decodedVideo = req.query.decodedVideo;
    let currentPath = req.query.currentPath;

    const video = Base64.decode(decodedVideo);
    const curPath = Base64.decode(currentPath);

    

    return getDuration(curPath, video, function(duration) {
        console.log(duration);
        return res.json({
            acknowledgement: {
                type: 'success',
                duration: duration
            }
        })
    });
})

function getDuration(path1, videoName, cb) {
    ffprobe(path.join(path1, videoName), { path: ffprobeStatic.path }, function (err, info) {
        if(err) {
            return console.log(err);
        }
        console.log(path.join(path1, videoName));
        cb(info.streams[0].duration);
    });
}

async function recursive(fileStructure, path1) {

    // console.log('-------------------New Root-------------------');

    const dir = await fs.promises.opendir(path1);

    for await (const dirant of dir) {
        // console.log('-------------------New Root-------------------');

        if(dirant.isDirectory()) {
            // console.log('----------------------New-Root----------------------');
            fileStructure.subDir.push({
                root: path.join(path1, dirant.name),
                lastPlayed: false,
                videos: [],
                subDir: {}
            })
            // console.log('--------------------Sub-Driectory-------------------');
            await recursive(fileStructure, path.join(path1, dirant.name));
        } else {
            if(dirant.name.slice(-4) == '.mp4') {
                if(fileStructure.subDir.length > 0) {
                    // getDuration(path1, dirant.name, function(duration) {
                        fileStructure.subDir[fileStructure.subDir.length - 1].videos.push({
                            name: dirant.name,
                            path: path1,
                            bookmarks: [],
                            // duration: duration,
                            position: fileStructure.subDir[fileStructure.subDir.length - 1].videos.length+1
                        })
                    // });
                } else {
                    // getDuration(path1, dirant.name, function(duration) {
                        fileStructure.videos.push({
                            name: dirant.name,
                            path: path1,
                            bookmarks: [],
                            // duration: duration,
                            position: fileStructure.videos.length+1
                        })
                    // });
                };
            }
            // console.log(dirant.name, dirant.isDirectory());
        }
    }
}

app.get('/', async (req, res, next) => {

    // console.log(currentPath)

    // const dir = await fs.promises.opendir(currentPath);

    // const files = [];

    // for await (const dirant of dir) {
    //     console.log(dirant.name.slice(-4));
    //     if(dirant.name.slice(-4) == '.mp4') {
    //         files.push(dirant.name);
    //     }
    // }

    // console.log(files, 'Files');

    return res.render('index', {
        // files: files,
        // currentPath: currentPath
    });
})

const server = app.listen(PORT);
console.log('Server started on ' + PORT);
