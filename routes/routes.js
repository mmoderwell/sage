const weather = require('../controllers/weather');
const unsplash = require('../controllers/unsplash');
const users = require('../controllers/users');
const info = require('../controllers/info');
const google = require('../controllers/cal');
const passport = require('passport');

module.exports = (app) => {
	//user creation / login routes
	app.get('/signup', (req, res) => {
		res.render('../views/signup.ejs');
	});
	app.get('/login', (req, res) => {
		res.render('../views/login.ejs');
	});
	app.get('/logout', (req, res) => {
		req.logout();
		req.session.destroy(() => {
			res.clearCookie('connect.sid');
			res.redirect('/login');
		})
	});
	app.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }),
		(req, res) => {
			res.redirect('/');
		});
	app.post('/signup', users.signup);

	//logged in user routes
	app.get('/', (req, res) => {
		//console.log(req.user);
		//console.log(req.isAuthenticated());
		if (req.isAuthenticated()) {
			res.render('../views/home.ejs', { user: req.user });
		} else {
			res.redirect('/login');
		}
	});
	app.get('/profile', users.profile);
	app.get('/auth/google', google.authorize);
	app.get('/auth/google/callback', google.get_events);
	app.post('/api/info/zip', info.zip); //for setting zip from profile page
	app.post('/api/info/user', info.user);
	app.get('/api/weather/full', weather.full);
	app.get('/api/weather/current', weather.current);
	app.get('/api/weather/day', weather.day);
	app.get('/api/unsplash/random', unsplash.random);
}