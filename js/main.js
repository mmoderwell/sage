function clock() {

    let time = new Date();
    let morning = true;
    let maridiem;
    let m_placeholder = '';
    let s_placeholder = '';
    let hours = time.getHours(),
        minutes = time.getMinutes(),
        seconds = time.getSeconds();

    if(hours > 12) {
    	morning = false;
    	hours -= 12;
    }

 	function clean(time) {
    	if (time < 10) {
      		time = '0' + time
    	}
    	return time;
  	}
    if(morning){
    	maridiem = 'AM';
    }else {
    	maridiem = 'PM'
    }

    document.querySelector('.time').innerHTML = `${clean(hours)}:${clean(minutes)}:${clean(seconds)} ${maridiem}`;
}

setInterval(clock, 1000);