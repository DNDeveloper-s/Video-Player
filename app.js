const express = require('express');
const fs = require('fs');
const path = require('path');

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

// const currentPath = args[2].slice(1, -1);

// console.log(currentPath);

// Serving static files 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.get('/load', async (req, res, next) => {

    const decodedVideo = req.query.decodedVideo;

    const video =Base64.decode(decodedVideo);

    const localPath = path.join(currentPath, video);
    const stat = fs.statSync(localPath);
    const fileSize = stat.size;
    console.log(fileSize);
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

})



app.get('/getDir', async(req, res, next) => {

    const fileStructure = {
        root: 'D:\\2019\\Html_Css_Java_more\\Tutorials\\Udemy Courses\\The Complete Python Course  Learn Python by Doing',
        videos: [],
        subDir: [
    
        ]
    };

    await recursive(fileStructure, 'D:\\2019\\Html_Css_Java_more\\Tutorials\\Udemy Courses\\The Complete Python Course  Learn Python by Doing');

    return res.json({
        files: fileStructure
    })
})

async function recursive(fileStructure, path1) {

    // console.log('-------------------New Root-------------------');

    const dir = await fs.promises.opendir(path1);

    for await (const dirant of dir) {
        // console.log('-------------------New Root-------------------');

        if(dirant.isDirectory()) {
            // console.log('----------------------New-Root----------------------');
            fileStructure.subDir.push({
                root: path.join(path1, dirant.name),
                videos: [],
                subDir: {}
            })
            // console.log('--------------------Sub-Driectory-------------------');
            await recursive(fileStructure, path.join(path1, dirant.name));
        } else {
            if(dirant.name.slice(-4) == '.mp4') {
                fileStructure.subDir[fileStructure.subDir.length - 1].videos.push({
                    name: dirant.name,
                    path: path1
                })
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
