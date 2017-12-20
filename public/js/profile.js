let app_info_button = document.getElementById('app_info');
app_info_button.addEventListener('click', app_edit);
let old_value = document.getElementById('zip').innerHTML;

function app_edit() {
	app_info_button.innerHTML = 'Save';
	document.getElementById('zip').innerHTML = '';
	document.querySelector('.zip_edit').style.display = 'block';

	app_info_button.addEventListener('click', app_save);
}

function app_reset() {
	document.getElementById('zip').innerHTML = old_value;
	document.querySelector('.zip_edit').style.display = 'none';
	app_info_button.innerHTML = 'Edit';
	app_info_button.removeEventListener('click', app_save);
	app_info_button.addEventListener('click', app_edit);
}

function app_save() {
	//get new zip value from input field
	let updated_info = document.getElementById('new_zip').value;

	if (!updated_info || updated_info === old_value) {
		app_reset();
	} else {

		document.getElementById('zip').innerHTML = updated_info;
		document.querySelector('.zip_edit').style.display = 'none';
		app_info_button.innerHTML = 'Saving<span>.</span><span>.</span><span>.</span>';

		const body = {
			zip: updated_info,
		};

		var http = new XMLHttpRequest();
		http.overrideMimeType('application/json');
		http.addEventListener("load", res_listen);
		http.open('POST', `http://localhost:8080/api/info/zip`, true);
		http.setRequestHeader('Content-Type', 'application/json');
		http.send(JSON.stringify(body));
	}
}

function res_listen() {
	//console.log(this.responseURL);
	window.location.replace(this.responseURL);
}