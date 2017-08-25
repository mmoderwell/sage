const weather = require('../controllers/weather');
const unsplash = require('../controllers/unsplash');

module.exports = (app) => {
    app.get('/api/weather/current', weather.current);
    app.get('/api/weather/day', weather.day);
    app.get('/api/unsplash/random', unsplash.random)
};