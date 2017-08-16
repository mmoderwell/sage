const weather = require('../controllers/weather');

module.exports =  (app) => {
	app.get('/api/weather', weather.forcast);
};
