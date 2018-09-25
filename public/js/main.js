let time = new Date();

function date() {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'];
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[time.getMonth()];
    let day = days[time.getDay()];
    let date = time.getDate();
    let year = time.getFullYear();

    switch (date) {
        case 1:
            date = "1st";
            break;
        case 2:
            date = "2nd";
            break;
        case 3:
            date = "3rd";
            break;
        case 21:
            date = "21st";
            break;
        case 22:
            date = "22nd";
            break;
        case 23:
            date = "23rd";
            break;
        case 31:
            date = "31st";
        default:
            date = date + "th";
    }

    document.querySelector('.date').innerHTML = `${day}, the ${date} of ${month}, ${year}.`;
}

function isMorning(dateObj) {
    let hours = dateObj.getHours();
    if (hours >= 12) {
        return false;
    } else {
        return true
    }
}

function clock() {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let maridiem;

    if (isMorning(time)) {
        maridiem = 'AM';
    } else {
        maridiem = 'PM';
        hours -= 12;
    }

    function clean(time) {
        if (time < 10) {
            time = '0' + time;
        }
        return time;
    }

    document.querySelector('.time').innerHTML = `${clean(hours)}:${clean(minutes)}:${clean(seconds)} ${maridiem}`;
}

function get_weather() {
    function responseListener() {
        let weather = JSON.parse(this.responseText);
        console.log(weather);
        let output;
        if (weather.error) {
            output = weather.error;
        } else {
            //output = `Current weather: ${(curr_weather.weather).toLowerCase()} and ${Math.round(curr_weather.temperature)} degrees.`;
        }
        document.getElementById('current_weather').innerHTML = output;
    }

    var weatherReq = new XMLHttpRequest();
    weatherReq.addEventListener("load", responseListener);
    weatherReq.open("GET", "/api/weather/full");
    weatherReq.send();
}

function picture() {
    function responseListener() {
        let data = JSON.parse(this.responseText);
        let caption = `Courtesy of unsplash.com\nPhoto by: ${data.name}`;
        document.getElementById('random_pic').src = data.url;
        document.querySelector('.caption').style.height = document.querySelector('.img_box').style.height;

        document.getElementById('caption').innerHTML = caption;
    }

    var photoReq = new XMLHttpRequest();
    photoReq.addEventListener("load", responseListener);
    photoReq.open("GET", "/api/unsplash/random");
    photoReq.send();
}

setInterval(clock, 1000);
date();
get_weather();

const morning_greetings = ['Good morning', 'Morning!', 'Rise n\' shine!', 'Greetings', 'Hi there'];
const afternoon_greetings = ['Good afternoon', 'Afternoon', 'Greetings', 'Welcome'];
if (isMorning(time)) {
    document.getElementById('greeting').innerHTML = morning_greetings[Math.floor(Math.random() * morning_greetings.length)];
} else {
    document.getElementById('greeting').innerHTML = afternoon_greetings[Math.floor(Math.random() * afternoon_greetings.length)];
}