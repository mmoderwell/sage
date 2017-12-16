const https = require('https');
const EventEmitter = require('events');

module.exports = {
    current(req, res) {
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
            path: '/forecast/5e746e713c26d1031a4f05f947afec40/41.878,-87.623?exclude=[minutely,hourly,daily,alerts,flags]',
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
    },
    day(req, res) {
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
            path: '/forecast/5e746e713c26d1031a4f05f947afec40/41.878,-87.623?exclude=[current,minutely,daily,alerts,flags]&lang=en&units=auto',
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
    },
    hello(req, res) {
        res.send({ hello: 'there' });
    }
};