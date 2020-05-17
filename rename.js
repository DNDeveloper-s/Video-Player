const fs = require('fs')
const path = require('path')

console.log(__dirname);

fs.renameSync(path.join('D:', '2019', 'Personal', 'Working', 'Video Chat App', 'not_renamed.txt'), path.join('D:', '2019', 'Personal', 'Working', 'Video Chat App', 'renamed.txt'))


console.log('renamed');