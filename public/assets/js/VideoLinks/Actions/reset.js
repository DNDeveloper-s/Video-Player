const db = require('../../db');

function resetEventHandler(el) {
    const curVideo = db.fetchVideo({
        root: el.dataset.root,
        mainRoot: el.dataset.mainroot,
        name: el.getAttribute('title')
    })

    db.updateVideo({
        root: el.dataset.root,
        mainRoot: el.dataset.mainroot,
        name: el.getAttribute('title'),
        completion: 0.000000000001,
        completed: false
    })

    const checkBoxEl = el.querySelector('.checkbox');
    checkBoxEl.classList.remove('completed');


    if(el.classList.contains('active')) {
        const video = document.querySelector('video');

        video.currentTime = 0;
    }

    el.querySelector('.completion-range').style.width = `0%`;
}

module.exports = resetEventHandler;