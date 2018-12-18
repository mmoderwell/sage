const weather = require('../controllers/weather');
const unsplash = require('../controllers/unsplash');
const users = require('../controllers/users');
const info = require('../controllers/info');
const passport = require('passport');

module.exports = (server) => {
	//user creation / login routes
	server.get('/signup', (req, res) => {
		res.render('../views/signup.ejs');
	});
	// server.get('/login', (req, res) => {
	// 	//res.render('../views/login.ejs');
	// 	app.render('/login');
	// });
	server.get('/logout', (req, res) => {
		req.logout();
		req.session.destroy(() => {
			res.clearCookie('connect.sid');
			res.redirect('/login');
		})
	});
	server.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }),
		(req, res) => {
			res.redirect('/');
		});
	server.post('/signup', users.signup);

	//logged in user routes
	server.get('/', (req, res) => {
		//console.log(req.user);
		//console.log(req.isAuthenticated());
		if (req.isAuthenticated()) {
			res.render('../views/home.ejs', { user: req.user });
		} else {
			res.redirect('/login');
		}
	});
	server.get('/profile', users.profile);
	server.post('/api/info/zip', info.zip); //for setting zip from profile page
	server.post('/api/info/user', info.user);
	server.get('/api/weather/full', weather.full);
	server.get('/api/weather/current', weather.current);
	server.get('/api/weather/day', weather.day);
	server.get('/api/unsplash/random', unsplash.random);
}