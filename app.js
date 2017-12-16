const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

//Authentication Packages
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);

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
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	store: new MongoDBStore({
		uri: 'mongodb://localhost:27017/sage',
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		const User = require('./models/user');
		const bcrypt = require('bcrypt');

		User.findOne({ username: username }, function(err, user) {
			if (err) return done(err);
			if (!user) return done(null, false);

			let hashed = user.password;
			bcrypt.compare(password, hashed, (err, response) => {
				if (response === true) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		});
	}
));

routes(app);

module.exports = app;