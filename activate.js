var request = require('request')
const config = require('./config');

var token = config.FB_PAGE_TOKEN

request({
    url: 'https://graph.facebook.com/v2.6/me/subscribed_apps', //URL to hit
    qs: {access_token: token}, //Query string data
    method: 'POST',
	}, function(error, response, body){
		if(error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
});