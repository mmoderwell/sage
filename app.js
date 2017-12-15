const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

//Authentication Packages
const session = require('express-session');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sage')
	.then(() => console.log('Connected to MongoDB.'));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(function(req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	//res.setHeader('Access-Control-Allow-Methods', 'GET');
	// Request headers you wish to allow
	//res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// Pass to next layer of middleware
	next();
});

app.use(session({
	secret: 'blueberry pancakes',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

routes(app);

module.exports = app;