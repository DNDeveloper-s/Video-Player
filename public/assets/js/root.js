const db = require('./db');
const dropDown = require('./dropDown');
const utils = require('./utils/utilities');


function loadRoot() {
    const videoListContainer = document.querySelector('.video-list > .list');
    
    // Fetching database
    const data = db.fetchDatabase();

    if(!data) return null;

    console.log(data);
    // console.log(data[0].root.split('\\'));

    const chooseDirSelect = document.querySelector('.choose_dir > select');
    chooseDirSelect.innerHTML = '';
    data.forEach(roots => {
        const rootName = roots.root.split('\\')[roots.root.split('\\').length - 1];
        const htmlToAdd = `
            <option data-root="${roots.root}" class='short' data-limit='26'>${rootName}</option>
        `;
        chooseDirSelect.insertAdjacentHTML('beforeend', htmlToAdd);
    })

    dropDown.initDropDown('.choose_dir_dropdown', function(props) {
        /**
         * props = {
         *      el: Element,
         *      label: Text
         * }
         */

        const root = props.el.dataset.root;

        const curRoot = data.find(cur => cur.root === root);

        if(curRoot.videos && curRoot.videos.length > 0) {
            const videosList = utils.sortVideoList(curRoot.videos);
            videoListContainer.innerHTML = '';
            videosList.forEach((video, ind) => {
                const htmlToAdd = `
                    <li data-position="${ind+1}" data-baseposition="${ind+1}" class="video-link">
                        <div class="checkbox">
                            <svg id="check-mark" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
                                <g id="Group_2" data-name="Group 2">
                                <path id="Path_18" data-name="Path 18" d="M256,0C114.844,0,0,114.844,0,256S114.844,512,256,512,512,397.156,512,256,397.156,0,256,0ZM402.207,182.625,217.75,367.083a21.325,21.325,0,0,1-30.166,0L88.46,267.958a10.664,10.664,0,0,1,0-15.085l15.081-15.082a10.669,10.669,0,0,1,15.086,0l84.04,84.042L372.04,152.458a10.669,10.669,0,0,1,15.086,0l15.081,15.082A10.664,10.664,0,0,1,402.207,182.625Z" fill="#e24a1a"/>
                                </g>
                            </svg>                          
                        </div>
                        <div class="name">${video.name}</div>
                        <div class="completion-range"></div>
                    </li>
                `;
                videoListContainer.insertAdjacentHTML('beforeend', htmlToAdd);
            })
        }
        
        if(!curRoot.subDir || !curRoot.subDir.length > 0) return;

        const chooseSubDirSelect = document.querySelector('.choose_subdir > select');
        chooseSubDirSelect.innerHTML = '';
        curRoot.subDir.forEach(roots => {
            const rootName = roots.root.split('\\')[roots.root.split('\\').length - 1];
            const htmlToAdd = `
                <option data-subRoot="${roots.root}" data-root="${root}" class='short' data-limit='26'>${rootName}</option>
            `;
            chooseSubDirSelect.insertAdjacentHTML('beforeend', htmlToAdd);
        })

        dropDown.initDropDown('.choose_subdir_dropdown', function(d) {
            console.log(d);
        });


    });
    
    chooseDirSelect.onchange = function () {
        console.log(this.selected);
    }

}


module.exports = {
    loadRoot
}