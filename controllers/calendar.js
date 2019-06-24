const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const {google} = require('googleapis');

const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];

const oauth2Client = new google.auth.OAuth2(
  '731498450846-0ka5ht776jego4grs0lh1cpgvcngai2t.apps.googleusercontent.com',
  'yc-GxFv9NB0n8Yhvjt6Gzz_m',
  'http://localhost:8080/auth/google/callback'
);

async function authenticate(scopes) {

	return new Promise((resolve, reject) => {
	    // grab the url that will be used for authorization
	    const authorizeUrl = oauth2Client.generateAuthUrl({
	      access_type: 'offline',
	      scope: scopes.join(' '),
	    });
	    const server = http
	      .createServer(async (req, res) => {
	        try {
	          if (req.url.indexOf('/oauth2callback') > -1) {
	            const qs = new url.URL(req.url, 'http://localhost:3000')
	              .searchParams;
	            res.end('Authentication successful! Please return to the console.');
	            server.destroy();
	            const {tokens} = await oauth2Client.getToken(qs.get('code'));
	            oauth2Client.credentials = tokens;
	            resolve(oauth2Client);
	          }
	        } catch (e) {
	          reject(e);
	        }
	      })
	      .listen(3000, () => {
	        // open the browser to the authorize url to start the workflow
	        opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
	      });
	    destroyer(server);
	  });
}


authenticate(scopes)
  .then(ret => {
  	console.log(ret);
  });

function listAllEvents(auth) {
	class Calendar {
		constructor(name, id) {
			this.name = name;
			this.id = id;
		}
	}
	class Event {
		constructor(name, calendar, time) {
			this.name = name;
			this.calendar = calendar;
			this.time = Date.parse(time);
		}
	}
	class DoneEmitter extends EventEmitter {}
	const doneEmitter = new DoneEmitter();

	let calendars = [];
	let event_list = [];
	const calendar = google.calendar({ version: 'v3', auth });

	calendar.calendarList.list({
		minAccessRole: 'owner',
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const cals = res.data.items;
		if (cals) {
			cals.forEach((calendar) => {
				calendars.push(new Calendar(calendar.summary, calendar.id));
			});
			doneEmitter.emit('done');
		} else {
			throw new Error('No calendars found.');
		}
	});
	let getEvents = (calendar_id, calendar_name) => {
		return new Promise((resolve, reject) => {
			calendar.events.list({
				calendarId: calendar_id,
				timeMin: (new Date()).toISOString(),
				maxResults: 10,
				singleEvents: true,
				orderBy: 'startTime',
			}, (err, res) => {
				if (err) {
					reject('The API returned an error: ' + err);
				}
				const events = res.data.items;
				if (events.length) {
					//console.log('Upcoming 5 events:');
					//console.log(events);
					events.map((event, i) => {
						if (event) {
							const start = event.start.dateTime || event.start.date;
							//console.log(`${start} - ${event.summary}`);
							event_list.push(new Event(event.summary, calendar_name, start));
						}
					});
					resolve(event_list);
				} else {
					resolve('No upcoming events found.');
					//console.log('No upcoming events found.');
				}
			});
		});
	}
	//when list of all calendars is available
	doneEmitter.on('done', () => {
		//call getEvents on all calendars
		const start = async() => {
			await Promise.all(calendars.map(async(c) => {
				await getEvents(c.id, c.name);
			}));
		}
		start().then(() => {
			//sort the events by start time
			event_list.sort((a, b) => {
				return a.time - b.time;
			});
			console.log(event_list);
		}).catch((e) => console.log('Error getting events', e));

	});
}

module.exports = {}