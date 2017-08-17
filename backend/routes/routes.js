const weather = require('../controllers/weather');

module.exports =  (app) => {
	app.get('/api/weather/current', weather.current);
	app.get('/api/weather/day', weather.day);
};
