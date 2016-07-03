var request = require('request')
const config = require('./config');

var token = config.FB_PAGE_TOKEN
var fb_page_id = config.FB_PAGE_ID

// https://graph.facebook.com/v2.6/<PAGE_ID>/thread_settings?access_token=<PAGE_ACCESS_TOKEN
// https://graph.facebook.com/v2.6/524205984446578/thread_settings?access_token=EAAZAnZBNHRVgcBAOMJPS7E96fcwZBURpAeAD3xEE1EbQuHitNjC8jgv0nUWVi3lRJZAylaVebyhAZBpD1OYJsPwFdEMdNRETbW76tcyV0rXN2GJgWjZBfLsDlplNSdZCAeM3IroF8AyWvEz3yIW9uTNSdl3cCsFeMzkvX65Enc61QZDZD

/* This example here uses a generic template message to start - a usual text message is of course possible as well .*/ 
request({
    url: 'https://graph.facebook.com/v2.6/' + fb_page_id + '/thread_settings', //URL to hit
    qs: {access_token: token}, //Query string data
    method: 'POST',
	json: {
		"setting_type":"call_to_actions",
		"thread_state":"new_thread",
		"call_to_actions":[
			{
				"message":{
							"attachment":{
							"type":"template",
							"payload": {
								"template_type":"generic",
								"elements": [
									{
										"title":"MESSAGE TITLE",
										"image_url":"IMAGE URL",
										"subtitle":"SUBTITLE",
								}]
							}
						}
					}
				}]
			}
	}, function(error, response, body){
			if(error) {
				console.log(error);
			} else {
				console.log(response.statusCode, body);
			}
});


  