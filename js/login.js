let button = document.getElementById('button');
let username = document.forms["login_form"]["username"];
let password = document.forms["login_form"]["password"];
let error = document.getElementById('error');
button.addEventListener('click', validate);

function validate() {
    if (username.checkValidity() && password.checkValidity()) {
        button.classList.add("onclick");
        send();
    } else {
        failed();
    }
    return false;
}

function success() {
    error.innerHTML = 'You\'re in.';
    error.style.opacity = '1';
    error.style.color = '#6EC867';
    button.classList.remove("onclick");
    button.classList.add("validate");
    setTimeout(() => {
        error.style.opacity = '0';
        error.innerHTML = 'No errors';
        error.style.color = '';
        button.classList.remove("validate");
        username.value = '';
        password.value = '';
    }, 2000);
}

function failed() {
    error.style.opacity = '1';
    button.classList.remove("onclick");
    if (!username.value || !password.value) {
        error.innerHTML = 'Please fill out all the fields.';
    }
}

function send() {
    const body = {
        username: username.value,
        password: password.value,
    };

    var http = new XMLHttpRequest();
    http.overrideMimeType('application/json');
    http.addEventListener("load", res_listen);
    http.open('POST', `http://localhost:8080/login`, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(body));

}

function res_listen() {
    console.log(this.responseText);
    success();
}