const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	fname: String,
	email: String,
	username: String,
	password: String,
	zip: Number,
	lat: Number,
	long: Number,
	city: String,

	google_access_token: String,
	google_refresh_token: String
});

const user = mongoose.model('user', userSchema);

module.exports = user;