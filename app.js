const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
//Authentication Packages
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);

mongoose.Promise = global.Promise;

let mongo_uri;
if (process.env.NODE_ENV === 'DEVELOPMENT') {
	mongo_uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/sage`;
} else {
	mongo_uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/sage`;
}
mongoose.connect(mongo_uri, { useNewUrlParser: true }).then(() => console.log('Connected to mongodb.')).catch((e) => {
	console.error('Connection to mongodb failed.');
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	// pass to next layer of middleware
	next();
});

app.use(session({
	secret: 'blueberry pancakes',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
		secure: false
	},
	store: new MongoDBStore({
		uri: mongo_uri,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

//not 100% what this does at the moment
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});

//passport local strategy, handles username and password
passport.use(new LocalStrategy(
	(username, password, done) => {
		const User = require('./models/user');
		const bcrypt = require('bcrypt');
		User.findOne({ username: username }, function (err, user) {
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
	}));

routes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.statusCode = 404;
	next(err);
});
// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'DEVELOPMENT' ? err : {};
	// render the error page
	res.status(err.statusCode || 500);
	res.render('error.ejs', { err });
});

module.exports = app;