class ContextMenu {
    constructor(el){
        this.el = document.querySelector(el);
        this.options = null;
        this.menuCoords = null;
        this.contextMenuEl = null;
    }

    init() {
        this.initEvents();

        this.outOfTarget();

        this.createOptions();
    }

    initEvents() {
        this.el.addEventListener('contextmenu', this.elIsClicked.bind(this));
    }

    elIsClicked(e) {
        e.preventDefault();
        // console.log('context menu')
        this.showMenu(e);
    }

    outOfTarget() {
        const thisClass = this;
        window.addEventListener('click', function(e) {
            // console.log(e.path);
            if(!e.path.includes(document.body.querySelector('.contextMenu'))) {
                // console.log('hiding');
                thisClass.hideMenu()
            }
        })
    }

    getCoords(e) {
        const coords = this.el.getBoundingClientRect();
        return {
            ...coords,
            top: e.pageY - coords.top,
            left: e.pageX - coords.left
        }
    }

    getElCoords(el) {
        const coords = el.getBoundingClientRect();
        this.menuCoords = coords;
    }

    createOptions() {
        const options = this.el.dataset.contextMenuOptions.split('-');
        const optionObj = [];
        options.forEach(option => {
            optionObj.push({name: option});
        });

        this.options = optionObj;
    }

    async showMenu(e) {
        const htmlToAdd = this.getMenuHTML(this.options);
        // console.log(htmlToAdd);

        let contextMenuEl = document.body.querySelector('.contextMenu');

        if(contextMenuEl) {
            await this.hideMenu();
        }

        document.body.insertAdjacentHTML('beforeend', htmlToAdd);

        this.contextMenuEl = document.body.querySelector('.contextMenu');

        if(!this.menuCoords) {
            this.getElCoords(this.contextMenuEl);
        }

        if(window.innerWidth - e.pageX < this.menuCoords.width) {
            this.contextMenuEl.style.right = `${window.innerWidth - e.pageX}px`;
            this.contextMenuEl.style.left = 'auto';
        } else {
            this.contextMenuEl.style.left = `${e.pageX}px`;
            this.contextMenuEl.style.right = 'auto';
        }

        // console.log(window.innerHeight - e.pageY, this.menuCoords.height, e.pageY);

        if(window.innerHeight - e.pageY < this.menuCoords.height) {
            this.contextMenuEl.style.bottom = `${window.innerHeight - e.pageY}px`;
            this.contextMenuEl.style.top = 'auto';
        } else {
            this.contextMenuEl.style.top = `${e.pageY}px`;
            this.contextMenuEl.style.bottom = 'auto';
        }

        this.initMenuActionEvents();

    }

    initMenuActionEvents() {

        this.contextMenuEl = document.body.querySelector('.contextMenu');

        const actionBtns = this.contextMenuEl.querySelectorAll('.option');

        const thisClass = this;
        actionBtns.forEach(actionBtn => {
            actionBtn.addEventListener('click', async function () {
                thisClass.initActionEvents(thisClass.el, this);

                await thisClass.hideMenu();
            })
        })
    }

    initActionEvents(thisEl, thisActionEl) {
        const event = thisActionEl.dataset.event.toLowerCase();
        try {
            const handler = require(`./VideoLinks/Actions/${event}`);

            handler(thisEl);
            

        } catch(e) {
            console.log('No handler found')
            console.log(e.message);
        }
    }

    async hideMenu() {
        await new Promise((res, rej) => {
            let contextMenuEl = document.body.querySelector('.contextMenu');

            if(contextMenuEl) {
                contextMenuEl.classList.add('hide');

                setTimeout(() => {
                    contextMenuEl.remove();
                    res();
                }, 300);
            }
        }) 
    }

    getMenuHTML(options) {
        let optionHtmlArr = [];
        options.forEach(option => {
            let html = `
                <div class="option" data-event="${option.name}">${option.name}</div>`;
            optionHtmlArr.push(html);
        });

        return `
            <div class="contextMenu" style="z-index: 400">
                <div class="menu_holder">
                    ${optionHtmlArr.join(' ')}
                </div>
            </div>
        `;
    }
}

module.exports = ContextMenu;