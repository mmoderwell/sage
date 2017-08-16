const DarkSky = require('dark-sky');
const darksky = new DarkSky('5e746e713c26d1031a4f05f947afec40');

module.exports = {
    forcast(req, res) {
    	darksky
    .options({
        latitude: 41.878,
        longitude: -87.623,
        exclude: ['minutely', 'hourly', 'daily', "alerts", "flags"]
    })
    .get()
    .then((data) => res.send(data));
    },
    greeting(req, res) {
    	res.send({hello: 'there'});
    }
}