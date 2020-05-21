class dragNDrop {
    constructor(el) {
        this.el = document.querySelector(el);
        this.itemCount = null;
        this.elCoords = this.el.getBoundingClientRect();
        this.props = {
            mouseIsDown: false,
            mouseIsMoving: false,
            mouseIsUp: false,
            downEl: null,
            upEl: null,
            start: null,
            downCoords: {
                x: null,
                y: null,
            },
            startedCoords: {
                x: null,
                y: null,
            }
        };
        this.positionUpdate = [];
        this.mouseData = {
            x: null,
            y: null,
        };
    }

    init() {

        this.setupElements();

        // this.initEvents();

        // this.initFrames();
    }

    setupElements() {
        this.itemCount = this.el.childElementCount;

        // Looping through items
        for(let i = 0; i < this.itemCount; i++) {
            const position = i+1;
            
            // console.log(position);
            const item = this.el.querySelector(`.dragndrop_item[data-baseposition="${position}"]`);
            // console.log(item);
            
            const calcTop = (position - 1) * 50;
            item.style.transform = `translateY(${calcTop}px)`;
        }
    }

    getItemEl(position) {
        return this.el.querySelector(`.dragndrop_item[data-position="${position}"]`);
    }

    initEvents() {
        this.el.addEventListener('mousedown', this.mouseIsDown.bind(this));
        this.el.addEventListener('mouseup', this.mouseIsUp.bind(this));
        this.el.addEventListener('mousemove', this.mouseMove.bind(this));
    }

    initFrames() {
        const thisClass = this;
        window.requestAnimationFrame(function animate() {
            if(thisClass.props.mouseIsDown) {
                const calcTop = thisClass.props.downCoords.y - thisClass.props.startedCoords.y;
                thisClass.props.downEl.style.transform = `translateY(${calcTop}px)`;

                const targetEl = thisClass.getElByCoords(thisClass.getCoordsByContainer(thisClass.mouseData));


                if(+targetEl.dataset.position !== +thisClass.props.start) {
                    thisClass.move(targetEl, thisClass.props.start);
                }
            }

            window.requestAnimationFrame(animate);
        })
    }

    getElByCoords(coords) {
        const position = Math.ceil(coords.y / 50);
        return this.getItemEl(position);
    }

    getCoordsByContainer(e) {
        return {
            x: e.x - this.elCoords.x,
            y: e.y - this.elCoords.y
        }
    }

    mouseIsDown(e) {
        e.preventDefault();
        const el = e.path.filter(cur => {
            if(cur.classList) {
                return cur.classList.contains('video-link');
            }
        })[0];
        this.props.mouseIsDown = true;

        this.props.start = el.dataset.position

        // const downCoords = this.getCoordsByContainer({x: e.pageX, y: e.pageY});

        this.props.startedCoords = {x: e.offsetX, y: e.offsetY};

        this.props.downEl = el;
        // this.props.downEl.style.zIndex = 200;
    }

    mouseIsUp(e) {
        e.preventDefault();
        this.props.mouseIsDown = false;
        this.move(this.props.downEl, this.props.start, true /** dontSend: true, Don't send update cause no change already sent for this */)
    }

    mouseMove(e) {
        this.props.mouseIsMoving = true;
        this.mouseData = {
            x: e.pageX,
            y: e.pageY
        }

        this.props.downCoords = this.getCoordsByContainer({x: e.pageX, y: e.pageY});
    }

    move(elToMove, to, dontSend) {

        const pastPositionOfElToMove = elToMove.dataset.position;
        const pastPositionOfDownEl = this.props.downEl.dataset.position;

        this.props.start = elToMove.dataset.position;

        const calcTop = (to - 1) * 50;
        elToMove.style.transform = `translateY(${calcTop}px)`;
        elToMove.dataset.position = to;
        
        this.props.downEl.dataset.position = this.props.start;

        // if(!dontSend) {
        //     this.positionUpdate.push({
        //         past: pastPositionOfElToMove,
        //         now: elToMove.dataset.position
        //     })
        //     this.positionUpdate.push({
        //         past: pastPositionOfDownEl,
        //         now: this.props.downEl.dataset.position
        //     })
        // } else {
        //     this.updatePosition(this.positionUpdate);
        //     this.positionUpdate = [];
        // }
    }

}

module.exports = dragNDrop;