'use strict';

const config = require('./config');
const bodyParser = require('body-parser');
const express = require('express');
var request = require('request');

// Messenger API parameters
if (!config.FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}

var token = config.FB_PAGE_TOKEN

/*
const sessions = {};
const findOrCreateSession = (sessions, fbid, cb) => {

    if (!sessions[fbid]) {
        console.log("New Session for:", fbid);
        sessions[fbid] = session;
        cb(sessions, fbid);
    }
};
*/

// Starting our webserver and putting it all together
// app configuration according to this tutorial:
// https://medium.com/chat-bots/have-15-minutes-create-your-own-facebook-messenger-bot-481a7db54892
var app = express()
app.set('port', process.env.PORT || 5000)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.get('/', function(req, res) {
	res.send('Hello world! I am a chatbot demo')
}) 
app.get('/webhook', function(req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})
// spin up server 
app.listen(app.get('port'), function() {
	console.log('running on port ' + app.get('port'))
})

// Message handler
app.post('/webhook', function(req, res) {
	var messaging_events = req.body.entry[0].messaging
	for (var i = 0; i < messaging_events.length; i++) {
		var event = req.body.entry[0].messaging[i]
		var sender = event.sender.id
		if (event.message && event.message.text) {
			var text = event.message.text
			handleTextMessage(sender, text)
			continue;
		}
		// handle responses from clicks on buttons
		if (event.postback) {
			var postback_text = JSON.stringify(event.postback.payload)
			handlePostback(sender, postback_text)
		}
	}
	res.sendStatus(200)
})


function reset(sender) {
	sendTextMessage(sender, "Resetting...")
	// reset state machine for this user here
}

/* Generic message processing functionality */

function handleTextMessage(sender, message_text) {
	console.log("handle text message: " +  message_text)
	if (message_text.toLowerCase() == "reset") {
		reset(sender)
		return
	}
	/* TODO: handle text messages here. */
	sendTextMessage(sender, 'echo: ' + message_text)
}

function handlePostback(sender, postback_text) {
	console.log('postback: ' + postback_text)
	/* TODO: process your postback codes here. Either if else or switch. */
	sendTextMessage(sender, 'Postback received: ' + postback_text) 
}

// generic text message
function sendTextMessage(sender, text) {
	var messageData = {
		text :text
	}
	sendMessage(sender, messageData)
}

function sendMessage(sender, messageData) {
	request( {
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message:messageData,
		}
	}, function(error, response, body) {
			if(error) {
				console.log('Error sending messages: ', error)
			} else if (response.body.error) {
				console.log('Error: ', response.body.error)
			}
	})
}

/* Functionality to integrate Microsoft LUIS models here */
function processAnswer(sender, textmessage) {
	console.log('process answer for: ' + textmessage)
	var intent = 'None'
	var entity = ''
	request({
		url: 'https://api.projectoxford.ai/luis/v1/application?id=' + config.LUIS_APP_ID 
				+ '&subscription-key=' + config.LUIS_SUBSCRIPTION_KEY + '&q=' + textmessage,
	}, function(error, response, body) {
			if(error) {
				console.log(error)
				console.log(body)
			}
			// console.log(body)
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body)
				intent = json.intents[0].intent
				console.log('extracted intent: ' + intent)
				if (json.entities[0]) {
					entity = json.entities[0].entity
					console.log('extracted entity: ' + entity)
				} else {
					console.log('no entity extracted for: ' + textmessage)
				}
				/* TODO: react on intent and entity appropriately. */
				sendTextMessage('echo: ' + textmessage):
			}
	})
}
