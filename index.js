"use strict";

require("./env");

var WebSocket = require("ws");
var slackConnect = require("./session");
var HTMLify = require("./htmlify");

var stocks = require("./apis/stocks");
var news = require("./apis/news");
var traffic = require("./apis/traffic");
var geo = require("./apis/geo");
var uber = require("./apis/uber");

slackConnect(process.env.BOT_KEY).then(function(data) {

	var ws = new WebSocket(data.url);

	ws.on("open", function() {
		console.log("Connected to Slack!");
	});

	var id = 1;

	ws.on("message", function(message) {

		var messageText = JSON.parse(message).text || "";

		var text = "Hello! :bowtie: I'm a multi-talented bot. I know these commands:\n"
		text += "`setstocks [ticker symbols]` to save a list of stocks\n";
		text += "`getstocks` to display the current price for your stocks\n";
		text += "`getnews` to get a list of the top 10 NY Times articles\n";
		text += "`setroute [address1] [address2]` to set your start and end address\n";
		text += "`getroute` to see Google's estimated travel time and distance\n";
		text += "`getride` to see Uber's esimated rate and time for an UberX";

		if (messageText === "help") {

			ws.send(JSON.stringify({
			    "id": id,
			    "type": "message",
			    "channel": "C2750K0GY",
			    "text": text
			}));
			id += 1;
		}

		if (messageText.indexOf("setstocks") >= 0) {

			stocks.set(messageText);

			ws.send(JSON.stringify({
				    "id": id,
				    "type": "message",
				    "channel": "C2750K0GY",
				    "text": "Thanks! I've recorded your stock list."
			}));
			id += 1;
		}

		if (messageText === "getstocks") {

			stocks.get().then(function(data) {

				var text = "";

				data.forEach(function(stock) {
					text += "*" + stock.t + "*\t" + stock.l + "\t" + stock.c + "\t" + stock.cp + "%\n";
				})

				ws.send(JSON.stringify({
				    "id": id,
				    "type": "message",
				    "channel": "C2750K0GY",
				    "mrkdwn": true,
				    "text": text
				}));
				id += 1;

			}, function(error) {
				console.log(error);
			});
		}

		if (messageText === "getnews") {

			news.get().then(function(data) {

				var text = "";

				for (var i = 0; i < 10; i++) {
					text += "_" + data.results[i].title + "_" + "\n" + data.results[i].url + "\n";
				}

				ws.send(JSON.stringify({
				    "id": id,
				    "type": "message",
				    "channel": "C2750K0GY",
				    "mrkdwn": true,
				    "text": text
				}));
				id += 1;

			}, function(error) {
				console.log(error);
			});
		}

		if (messageText.indexOf("setroute") >= 0) {

			traffic.setRoute(messageText);

			ws.send(JSON.stringify({
			    "id": id,
			    "type": "message",
			    "channel": "C2750K0GY",
			    "text": "Thanks! I've set your start and end address."
			}));
			id += 1;
		}

		if (messageText === "getroute") {

			traffic.getRoute().then(function(data) {

				var text = "Your destination is *" + data.rows[0].elements[0].distance.text + "* away.\n";
				text += "Estimated travel time is *" + data.rows[0].elements[0].duration.text + "*.";

				ws.send(JSON.stringify({
				    "id": id,
				    "type": "message",
				    "channel": "C2750K0GY",
				    "mrkdwn": true,
				    "text": text
				}));
				id += 1;

			}, function(error) {
				console.log(error);
			});
		}

		if (messageText === "getride") {

			traffic.getRide().then(function(data) {

				var text = "";

				ws.send(JSON.stringify({
				    "id": id,
				    "type": "message",
				    "channel": "C2750K0GY",
				    "mrkdwn": true,
				    "text": text
				}));
				id += 1;

			}, function(error) {
				console.log(error);
			});
		}
	});

	ws.on("error", function(error) {
		console.log(error);
	});

}, function(error) {
	throw error;
});