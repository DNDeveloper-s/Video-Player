const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './public/assets/js/main.js',
        message: './public/assets/js/message.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/assets/js'),
        filename: '[name].bundle.js'
    },
    watch: true
}