function date() {
    let time = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[time.getMonth()];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'];
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

function clock() {
    let time = new Date();
    let morning = true;
    let maridiem;
    let hours = time.getHours(),
        minutes = time.getMinutes(),
        seconds = time.getSeconds();

    if (hours > 12) {
        morning = false;
        hours -= 12;
    }
    if (hours == 12) {
        morning = false;
    }

    function clean(time) {
        if (time < 10) {
            time = '0' + time;
        }
        return time;
    }
    if (morning) {
        maridiem = 'AM';
    } else {
        maridiem = 'PM'
    }

    document.querySelector('.time').innerHTML = `${clean(hours)}:${clean(minutes)}:${clean(seconds)} ${maridiem}`;
}

setInterval(clock, 1000);
date();
current_weather();
day_forcast();


function current_weather() {
    function responseListener() {
        let curr_weather = JSON.parse(this.responseText);
        let output = `Current weather: ${(curr_weather.weather).toLowerCase()} and ${Math.round(curr_weather.temperature)} degrees.`;
        document.getElementById('current_weather').innerHTML = output;
    }

    var weatherReq = new XMLHttpRequest();
    weatherReq.addEventListener("load", responseListener);
    weatherReq.open("GET", "http://localhost:8080/api/weather/current");
    weatherReq.send();
}

function day_forcast() {
    function responseListener() {
        let day_weather = JSON.parse(this.responseText);
        let output = `Plan for ${(day_weather.summary).toLowerCase()}`;
        document.getElementById('day_forcast').innerHTML = output;
    }

    var weatherReq = new XMLHttpRequest();
    weatherReq.addEventListener("load", responseListener);
    weatherReq.open("GET", "http://localhost:8080/api/weather/day");
    weatherReq.send();
}