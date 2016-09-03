(function() {

"use strict";

var http = require("http");
var qs = require("../querystring");

var stockList = "";

module.exports = {

	get: function() {

		var googleOptions = {
			q: stockList
		}

		var promise = new Promise(function(resolve, reject) {

			var httpOptions = {
			hostname: "finance.google.com",
			port: 80,
			path: "/finance/info?" + qs(googleOptions),
			method: "GET"
			};

			var request = http.request(httpOptions, function(response) {

				var string = "";

				response.setEncoding("utf-8");
				
				response.on("data", function(chunk) {
					string += chunk;
				});

				response.on("end", function() {
					string = string.replace(/\/\//g, "");

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
	set: function(stocksString) {
		
		var regex = new RegExp(/\[([A-Za-z,.\s]+)\]/);
		var match = regex.exec(stocksString);

		if (match !== null) {
			stockList = match[1].split(" ").join(",");
		}
	}
}

})();