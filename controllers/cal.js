const fs = require('fs');
const EventEmitter = require('events');
const readline = require('readline');

const User = require('../models/user');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

const oauth2Client = new google.auth.OAuth2(
	'731498450846-0ka5ht776jego4grs0lh1cpgvcngai2t.apps.googleusercontent.com',
	'yc-GxFv9NB0n8Yhvjt6Gzz_m',
	'http://localhost:8080/auth/google/callback'
);

google.options({ auth: oauth2Client });

oauth2Client.on('tokens', (tokens) => {
	if (tokens.refresh_token) {
		// store the refresh_token in my database!
		console.log('Refresh ', tokens.refresh_token);
	}
	console.log('Access ', tokens.access_token);
});

// Create an OAuth2 client with the given credentials then execute the
// given callback function.
// @param {function} callback to call with the authorized client.

function authorize(callback) {

	oauth2Client.on('tokens', (tokens) => {
		if (tokens.refresh_token) {
			// store the refresh_token in my database!
			console.log('Refresh ', tokens.refresh_token);
		}
		console.log('Access ', tokens.access_token);
	});

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oauth2Client, callback);
		oauth2Client.setCredentials(JSON.parse(token));
		callback(oauth2Client);
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oauth2Client, callback) {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	return authUrl;
	// console.log('Authorize this app by visiting this url:', authUrl);
	// const rl = readline.createInterface({
	// 	input: process.stdin,
	// 	output: process.stdout,
	// });
	// rl.question('Enter the code from that page here: ', async (code) => {
	// 	rl.close();
	// 	const { tokens } = await oauth2Client.getToken(code);
	// 	oauth2Client.setCredentials(tokens);
	// 	fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
	// 		if (err) console.error(err);
	// 		console.log('Token stored to', TOKEN_PATH);
	// 	});
	// 	callback(oauth2Client);
	// });
}

/**
 * Lists the next events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

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
			console.log(cals);
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
				orderBy: 'startTimeauthorize',
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
		const start = async () => {
			await Promise.all(calendars.map(async (c) => {
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

module.exports = {
	async authorize(req, res) {

		User.findOne({ username: req.user.username }, (err, user) => {
			console.log('Auth User ', user);

			if (user.google_refresh_token !== null) {
				oauth2Client.setCredentials({ refresh_token: user.google_refresh_token });
				res.redirect('/auth/google/callback');
			} else {
				const redirect = getAccessToken(oauth2Client, listAllEvents);
				res.redirect(redirect);
			}
		});
	},

	async get_events(req, res) {
		const { code } = req.query;
		console.log('Code ', code);

		const { tokens } = await oauth2Client.getToken(code);
		await oauth2Client.setCredentials(tokens);

		await User.findOneAndUpdate({ username: req.user.username }, {
			$set: {
				google_access_token: tokens.access_token,
				google_refresh_token: tokens.refresh_token,
			}
		}, { new: true }, (err, user) => {

			console.log(user);
			res.send({ oauth2Client });
		});
		//console.log(oauth2Client);
		//listAllEvents(oauth2Client);

	}
};