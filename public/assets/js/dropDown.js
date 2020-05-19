function initDropDown(selector, cb) {
    $(selector).each(function() {

        var dropdown = $('<div />').addClass(`${selector.slice(1)}Drop dropdown selectDropdown`);

        dropdown.css('display', 'block');

        $(this).wrap(dropdown);

        var label = $('<span />').text($(this).attr('placeholder')).insertAfter($(this));
        var list = $('<ul />');

        $(this).find('option').each(function() {
            list.append($('<li />').append($(`<a title="${$(this).text()}" data-root="${$(this).attr('data-root')}" />`).text($(this).text())));
        });

        list.insertAfter($(this));

        // if($(this).find('option:selected').length) {
        //     label.text($(this).find('option:selected').text());
        //     list.find('li:contains(' + $(this).find('option:selected').text() + ')').addClass('active');
        //     $(this).parent().addClass('filled');
        // }

        });

        console.log(`.${selector.slice(1)}Drop ul li a`);
        $(`${selector}Drop ul li a`).on('click touch', function(e) {
            // $(this).attr('data-clickEvent', true);
            e.preventDefault();
            var dropdown = $(this).parent().parent().parent();
            var active = $(this).parent().hasClass('active');
            var label = active ? dropdown.find('select').attr('placeholder') : $(this).text();

            dropdown.find('option').prop('selected', false);
            dropdown.find('ul li').removeClass('active');

            dropdown.toggleClass('filled', !active);
            dropdown.children('span').text(label);

            cb({
                el: $(this)[0],
                label: label
            });

            if(!active) {
                dropdown.find('option:contains(' + $(this).text() + ')').prop('selected', true);
                $(this).parent().addClass('active');
            }

            dropdown.removeClass('open');
        });

        $(`${selector}Drop > span`).on('click touch', function(e) {
            var self = $(this).parent();
            self.toggleClass('open');
        });

        $(document).on('click touch', function(e) {
            var dropdown = $(`${selector}Drop`);
            if(dropdown !== e.target && !dropdown.has(e.target).length) {
                dropdown.removeClass('open');
            }
        });
}

function disposeDropDown(parentSel, selector) {
    const el = document.querySelector(selector);

    const parentEl = el.closest(parentSel);
    
    const cloneEl = el.cloneNode(true);

    parentEl.innerHTML = '';

    parentEl.appendChild(cloneEl);

    
}

module.exports = {
    initDropDown,
    disposeDropDown
}