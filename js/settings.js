function night_mode() {
    let body = document.getElementsByTagName("body")[0];
    let content = document.querySelectorAll('.content');
    let box = document.querySelectorAll('.box');
    let side_bar = document.getElementById('sidebar-wrapper');
    let night_mode = document.getElementById('night_mode')

    if (night_mode.getAttribute('class')) {
        disable();
    } else {
        enable();
    }

    function enable() {
        night_mode.setAttribute('class', 'active');
        body.style.background = '#000';
        body.style.color = '#bfbfbf';
        side_bar.style.background = '#161616';
        Array.prototype.forEach.call(box, (e) => {
            e.style.backgroundColor = '#1f2846';
        });
        Array.prototype.forEach.call(content, (e) => {
            e.style.color = '#bfbfbf';
        });
        console.log('Night mode is active.');
    }

    function disable() {
        night_mode.removeAttribute('class', 'active');
        body.style.background = '';
        body.style.color = '';
        side_bar.style.background = '';
        Array.prototype.forEach.call(box, (e) => {
            e.style.backgroundColor = '';
        });
        Array.prototype.forEach.call(content, (e) => {
            e.style.color = '';
        });
        console.log('Night mode is deactivated.');
    }
}

document.getElementById('night_mode').addEventListener('click', night_mode);