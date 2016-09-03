(function() {

"use strict";

require("../env");

var https = require("https");
var qs = require("../querystring");

module.exports = {

	get: function() {

		var nytOptions = {
			"api-key": process.env.NYT_KEY
		}

		var section = "home";

		var promise = new Promise(function(resolve, reject) {

			var httpsOptions = {
				hostname: "api.nytimes.com",
				port: 443,
				path: "/svc/topstories/v2/" + section + ".json?" + qs(nytOptions),
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