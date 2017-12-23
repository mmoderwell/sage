const User = require('../models/user');
const https = require('https');
const EventEmitter = require('events');

module.exports = {

    //takes zip from req body and sends to zipcodeapi to get addition information to save to database
    zip(req, res) {

        const { zip } = req.body;

        class DoneEmitter extends EventEmitter {}

        const myEmitter = new DoneEmitter();
        myEmitter.on('done', () => {
            let local_data = {
                lat: data.lat,
                long: data.lng,
                city: data.city,
                zip: data.zip_code
            };

            //console.log(local_data);

            User.findOne({ username: req.user.username }, (err, user) => {
                user.zip = local_data.zip;
                user.city = local_data.city;
                user.lat = local_data.lat;
                user.long = local_data.long;

                user.save()
                    .then(() => {
                        res.setHeader('Content-Type', 'text/html');
                        res.redirect('/profile');
                    });
            });

        });

        let data = [];
        const options = {
            hostname: 'www.zipcodeapi.com',
            path: `/rest/FhoghxxmtXnLwcZhvH9yGZ1cQKT8cGykPkGwyDx08oCy44commODQljuWZb1NvYs/info.json/${zip}/degrees`,
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
    user(req, res) {

        let { name, email, username } = req.body;

        User.findOne({ username: req.user.username }, (err, user) => {
            user.name = name;
            user.email = email;
            user.username = username;

            user.save()
                .then(() => {
                    res.setHeader('Content-Type', 'text/html');
                    res.redirect('/profile');
                });
        });

    },
    hello(req, res) {
        res.send({ hello: 'there' });
    }
};