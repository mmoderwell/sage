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
    default: date = date + "th";
	}

	document.querySelector('.date').innerHTML = `Today is ${day}, the ${date} of ${month}, ${year}.`;
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
    if (morning){
    	maridiem = 'AM';
    }else {
    	maridiem = 'PM'
    }

    document.querySelector('.time').innerHTML = `${clean(hours)}:${clean(minutes)}:${clean(seconds)} ${maridiem}`;
}

setInterval(clock, 1000);
date();

function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);

oReq.open("GET", "https://api.darksky.net/forecast/5e746e713c26d1031a4f05f947afec40/41.881,-87.623", true);
oReq.send();