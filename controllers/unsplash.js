const https = require('https');
const EventEmitter = require('events');

module.exports = {
    random(req, res) {
        class DoneEmitter extends EventEmitter {}

        const myEmitter = new DoneEmitter();
        myEmitter.on('done', () => {
            let photo = {
                //location: data.location.title || '',
                url: data.urls.regular,
                name: data.user.name
            };

            res.send(photo);
        });

        let data = [];
        const options = {
            hostname: 'api.unsplash.com',
            path: '/photos/random/?client_id=10fc8fe586af93eea1dedd26262c01bc9bc91e15ccae5e7f5bed1fb99f448d6d&orientation=landscape',
            method: 'GET'
        };

        const secure_req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (d) => {
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
};