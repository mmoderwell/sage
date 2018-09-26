const https = require('https');
const EventEmitter = require('events');

module.exports = {
    full(req, res) {
        if (req.user.lat === undefined || req.user.long === undefined) {
            res.send({ error: 'Please enter your zip at the profile page.' });
        } else {
            let data = [];
            class DoneEmitter extends EventEmitter {}
            const dsEmitter = new DoneEmitter();

            dsEmitter.on('done', () => {
                const weather = {
                    curr_temperature: data.currently.temperature,
                    curr_summary: data.currently.summary,
                    curr_short: data.currently.icon,
                    summary: data.hourly.summary,
                    short: data.hourly.icon
                };
                res.send(weather);
            });

            dsEmitter.on('error', (e) => {
                const error = {
                    error: e.message
                };
                res.send(error);
            });

            const options = {
                hostname: 'api.darksky.net',
                path: `/forecast/5e746e713c26d1031a4f05f947afec40/${req.user.lat},${req.user.long}?exclude=[minutely,daily,alerts,flags]`,
                method: 'GET'
            };
            //https request to the Dark Sky API to get weather information
            const secure_req = https.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (d) => {
                    data.push(d);
                });
                res.on('end', () => {
                    data = JSON.parse(data.join(''));
                    dsEmitter.emit('done');
                });
            });

            secure_req.on('error', (e) => {
                console.error(`problem with request to Dark Sky API: ${e.message}`);
                dsEmitter.emit('error', e);
            });
            secure_req.end();
        }
    },
    current(req, res) {
        if (req.user.lat === undefined || req.user.long === undefined) {
            res.send({ error: 'zip' });
        } else {
            class DoneEmitter extends EventEmitter {}

            const myEmitter = new DoneEmitter();
            myEmitter.on('done', () => {
                let weather = {
                    temperature: data.currently.temperature,
                    weather: data.currently.summary
                };

                res.send(weather);
            });

            let data = [];
            const options = {
                hostname: 'api.darksky.net',
                path: `/forecast/5e746e713c26d1031a4f05f947afec40/${req.user.lat},${req.user.long}?exclude=[minutely,hourly,daily,alerts,flags]`,
                method: 'GET'
            };

            const secure_req = https.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (d) => {
                    //process.stdout.write(d);
                    data.push(d);
                });
                res.on('end', () => {
                    data = JSON.parse(data.join(''));
                    //console.log('No more data in response.');
                    myEmitter.emit('done');
                });
            });

            secure_req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });
            secure_req.end();
        }
    },
    day(req, res) {
        if (req.user.lat === undefined || req.user.long === undefined) {
            res.send({ error: 'zip' });
        } else {
            class DoneEmitter extends EventEmitter {}

            const myEmitter = new DoneEmitter();
            myEmitter.on('done', () => {
                let weather = {
                    summary: data.hourly.summary,
                    short: data.hourly.icon
                };
                res.send(weather);
            });

            let data = [];
            const options = {
                hostname: 'api.darksky.net',
                path: `/forecast/5e746e713c26d1031a4f05f947afec40/${req.user.lat},${req.user.long}?exclude=[current,minutely,daily,alerts,flags]&lang=en&units=auto`,
                method: 'GET'
            };

            const secure_req = https.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (d) => {
                    //process.stdout.write(d);
                    data.push(d);
                });
                res.on('end', () => {
                    data = JSON.parse(data.join(''));
                    //console.log('No more data in response.');
                    myEmitter.emit('done');
                });
            });

            secure_req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });
            secure_req.end();
        }
    },
    hello(req, res) {
        res.send({ hello: 'there' });
    }
};