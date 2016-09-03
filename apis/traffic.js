(function() {

"use strict";

var https = require("https");
var qs = require("../querystring");

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
			traffic_model: "best_guess"
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
	getRide: function() {

	},
	setRoute: function(addressString) {
		
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