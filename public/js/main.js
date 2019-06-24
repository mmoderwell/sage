let time = new Date();

let weather_states = ['clear-day', 'clear-night', 'rain', 'snow', 'sleet', 'wind', 'fog', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night'];

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
            break;
        default:
            date = date + "th";
    }

    document.querySelector('.date').innerHTML = `${day}, ${month} ${date}, ${year}`;
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
    time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let maridiem;

    if (isMorning(time)) {
        maridiem = 'AM';
    } else {
        maridiem = 'PM';
        // convert to 12 hour time
        if (hours !== 12) hours -= 12;
    }
    //add a 0 to numbers that are only one digit
    function clean(time) {
        if (time < 10) {
            time = '0' + time;
        }
        return time;
    }
    //update the time on the page
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
            let icon = weather.curr_short;
            document.getElementById('weather_icon').src = `/img/weather/${icon}.svg`;
            output = `${Math.round(weather.curr_temperature)}\xB0F and ${(weather.curr_summary).toLowerCase()}`;
        }
        document.getElementById('weather').innerHTML = output;
    }

    var weatherReq = new XMLHttpRequest();
    weatherReq.addEventListener("load", responseListener);
    weatherReq.open("GET", "/api/weather/full");
    weatherReq.send();
}

function greeting() {
    const morning_greetings = ['Good morning,', 'Morning,', 'Rise n\' shine,', 'Greetings,', 'Hi there', 'Welcome back', 'How\'s it going,'];
    const afternoon_greetings = ['Good afternoon,', 'Afternoon,', 'Greetings,', 'Welcome,', 'Hi', 'Hello', 'Welcome back,', 'Good day,'];
    const night_greetings = ['Good evening,', 'Evening,', 'Welcome,', 'Hi', 'Hello', 'Good night,', 'Sweet dreams,', 'Welcome back,'];

    if (isMorning(time)) {
        document.getElementById('greeting').innerHTML = morning_greetings[Math.floor(Math.random() * morning_greetings.length)];
    } else if (time.getHours() < 17) { //if its the afternoon and before 5 o'clock
        document.getElementById('greeting').innerHTML = afternoon_greetings[Math.floor(Math.random() * afternoon_greetings.length)];
    } else {
        document.getElementById('greeting').innerHTML = night_greetings[Math.floor(Math.random() * night_greetings.length)];
    }
}

setInterval(clock, 1000);
date();
greeting();
get_weather();