const path = require('path');
const express = require('express');
const next = require('next');
const server = express();
const app = next({
	dev: process.env.NODE_ENV !== 'PRODUCTION',
  	dir: './client/', // Set directory to search for pages
});
const handle = app.getRequestHandler();


require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
//Authentication Packages
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);

app.prepare().then(() => {
	//server.use(express.static(__dirname + '/client/static'));
	server.use('/static', express.static(path.join(__dirname, '../client/static')));
	server.get('*', (req, res) => {
	    return handle(req, res)
	})
}).catch((e) => {
	  console.error(e)
})

server.get('/login', (req, res) => {
	//res.render('../views/login.ejs');
	app.render(req, res, '/login')
});

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

//the database connection is disconnected
mongoose.connection.on('disconnected', function () {
	console.log('Connection to mongodb is disconnected.');
});

// set the view engine to ejs
//app.set('view engine', 'ejs');

server.use(bodyParser.json());
server.use((req, res, next) => {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Pass to next layer of middleware
	next();
});

server.use(session({
	secret: 'blueberry pancakes',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	store: new MongoDBStore({
		uri: mongo_uri,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false }
}));
server.use(passport.initialize());
server.use(passport.session());

//not 100% what this does at the moment
server.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});

//passport local strategy, handles username and password
passport.use(new LocalStrategy(
	(username, password, done) => {
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
	}));

routes(server);

// catch 404 and forward to error handler
server.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// error handler
server.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'DEVELOPMENT' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error.ejs', { err });
});

module.exports = server;