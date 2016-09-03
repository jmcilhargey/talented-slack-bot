"use strict";

var https = require("https");
var qs = require("./querystring");

module.exports = function(token) {

	var slackProperties = {
		token: token,
		simple_latest: true,
		no_unreads: true,
		pretty: 1
	};

	var httpsOptions = {
		hostname: "slack.com",
		port: 443,
		path: "/api/rtm.start?" + qs(slackProperties),
		method: "GET"
	};

	var promise = new Promise(function(resolve, reject) {

		var request = https.request(httpsOptions, function(response) {

			var string = "";

			response.on("error", function(error) {
				reject("responseError: " + error);
			});

			response.on("data", function(chunk) {
				string += chunk.toString("utf-8");
			});

			response.on("end", function() {
				resolve(JSON.parse(string));
			});
		});
		request.end();

		request.on('error', function(error) {
		 	reject("requestError: " + error);
		});
	});
	return promise;
};

