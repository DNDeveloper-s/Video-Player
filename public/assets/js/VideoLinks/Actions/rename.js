function renameVideoLink(el) {
    // const el = document.querySelector(elSelector);
    const videoNameEl = el.querySelector('.name');
    initRename(el);

    videoNameEl.addEventListener('focusout', function() {
        disposeRename(el);
    })
}

function initRename(el) {
    const videoNameEl = el.querySelector('.name');

    videoNameEl.setAttribute('contenteditable', true);
    videoNameEl.setAttribute('spellcheck', false);
    videoNameEl.style.textOverflow = 'unset';
    videoNameEl.style.pointerEvents = 'auto';

    videoNameEl.focus();
    videoNameEl.scrollTo({
        top: 0,
        left: videoNameEl.scrollWidth
    })
    setCaretToEnd(videoNameEl);
}

function disposeRename(el) {
    const videoNameEl = el.querySelector('.name');

    videoNameEl.setAttribute('contenteditable', false);
    videoNameEl.style.whiteSpace = 'nowrap';
    videoNameEl.style.textOverflow = 'ellipsis';
    videoNameEl.style.pointerEvents = 'none';
    videoNameEl.scrollTo({
        top: 0,
        left: 0
    })
}

function setCaretToEnd(target/*: HTMLDivElement*/) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(target);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    target.focus();
    range.detach(); // optimization
  
    // set scroll to the end if multiline
    target.scrollTop = target.scrollHeight; 
}

module.exports = renameVideoLink;