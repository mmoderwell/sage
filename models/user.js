const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	email: String,
	username: String,
	password: String
});

const user = mongoose.model('user', userSchema);

module.exports = user;