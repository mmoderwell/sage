const fs = require('fs');
const EventEmitter = require('events');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('../credentials/credentials.json', (err, content) => {
	if (err) return console.log('Error loading client secret file:', err);
	// Authorize a client with credentials, then call the Google Calendar API.
	authorize(JSON.parse(content), listAllEvents);
	//authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
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
				return a.time - b.time
			});
			console.log(event_list);
		}).catch((e) => console.log('Error getting events', e));

	});
}

module.exports = {}