(function() {

"use strict";

require("../env");

var https = require("https");
var qs = require("../querystring");

module.exports = {

	getPrice: function(geoData) {

		var uberOptions = {
			start_latitude: +geoData[0].lat,
			start_longitude: +geoData[0].lng,
			end_latitude: +geoData[1].lat,
			end_longitude: +geoData[1].lng
		}

		var promise = new Promise(function(resolve, reject) {

			var httpsOptions = {
				hostname: "api.uber.com",
				port: 443,
				path: "/v1/estimates/price?" + qs(uberOptions),
				headers: {
					"Authorization": "Token " + process.env.UBER_TOKEN
				},
				method: "GET"
			};

			var request = https.request(httpsOptions, function(response) {

				var string = "";

				response.setEncoding("utf-8");
				
				response.on("data", function(chunk) {
					string += chunk;
				});

				response.on("end", function() {

					try {
						resolve(JSON.parse(string));
					} catch (error) {
						reject(error);
					}
				});
			});
			request.on("error", function(error) {
				reject(error);
			});
			request.end();
		});
		return promise;
	},
	getTimes: function(geoData) {

		var uberOptions = {
			start_latitude: +geoData[0].lat,
			start_longitude: +geoData[0].lng
		}

		var promise = new Promise(function(resolve, reject) {

			var httpsOptions = {
				hostname: "api.uber.com",
				port: 443,
				path: "/v1/estimates/time?" + qs(uberOptions),
				headers: {
					"Authorization": "Token " + process.env.UBER_TOKEN
				},
				method: "GET"
			};

			var request = https.request(httpsOptions, function(response) {

				var string = "";

				response.setEncoding("utf-8");
				
				response.on("data", function(chunk) {
					string += chunk;
				});

				response.on("end", function() {

					try {
						resolve(JSON.parse(string));
					} catch (error) {
						reject(error);
					}
				});
			});
			request.on("error", function(error) {
				reject(error);
			});
			request.end();
		});
		return promise;
	}
}

})();