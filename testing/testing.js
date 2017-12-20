let app_info_button = document.getElementById('app_info');
app_info_button.addEventListener('click', app_edit);

function app_edit() {
	app_info_button.innerHTML = 'Save';
	document.getElementById('zip').innerHTML = '';
	document.querySelector('.zip_edit').style.display = 'block';

	app_info_button.addEventListener('click', app_save);
}

function app_save() {
	let updated_info = document.getElementById('new_zip').value;

	document.getElementById('zip').innerHTML = updated_info;
	document.querySelector('.zip_edit').style.display = 'none';
	console.log(updated_info);
	app_info_button.innerHTML = 'Edit';

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

function res_listen() {
	console.log(this.responseText);
}