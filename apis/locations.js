(function() {

"use strict";

var https = require("https");
var qs = require("../querystring");

require("../env")

var addresses = [];

module.exports = {

	getRoute: function() {

		var googOptions = {
			origins: addresses[0],
			destinations: addresses.slice(1).join("|"),
			mode: "driving",
			language: "english",
			units: "imperial",
			departure_time: "now",
			traffic_model: "best_guess",
			key: process.env.GOOG_KEY
		}

		var promise = new Promise(function(resolve, reject) {

			var httpsOptions = {
				hostname: "maps.googleapis.com",
				port: 443,
				path: "/maps/api/distancematrix/json?" + qs(googOptions),
				method: "GET"
			};

			var request = https.request(httpsOptions, function(response) {

				var string = "";

				response.setEncoding("utf-8");

				response.on("data", function(chunk) {
					string += chunk;
				});

				response.on("end", function() {
					console.log(string);
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
	getGeo: function() {

		var promise = new Promise(function(resolve, reject) {

			var geoCoordinates = [];
			var completedRequests = 0;

			for (var i = 0; i < addresses.length; i++) {

				var googOptions = {
					address: addresses[i],
					components: "country:US",
					key: process.env.GOOG_KEY
				}

				var httpsOptions = {
					hostname: "maps.googleapis.com",
					port: 443,
					path: "/maps/api/geocode/json?" + qs(googOptions),
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
							geoCoordinates.push(JSON.parse(string).results[0].geometry.location);

							if (++completedRequests === addresses.length) {
								resolve(geoCoordinates);
							}
						} catch (error) {
							reject(error);
						}
					});
				});
				request.on("error", function(error) {
					reject(error)
				});
				request.end();
			}

		});
		return promise;
	},
	setAddress: function(addressString) {

		addresses = [];

		var regex = new RegExp(/\[(.*?)\]/g);
		var match = regex.exec(addressString);

		while (match !== null) {
			addresses.push(match[1]);
			match = regex.exec(addressString);
		}
	}
}

})();
