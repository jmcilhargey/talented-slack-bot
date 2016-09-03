"use strict";

require("./env");

var WebSocket = require("ws");
var slackConnect = require("./session");
var HTMLify = require("./htmlify");

var stocks = require("./apis/stocks");
var news = require("./apis/news");
var locations = require("./apis/locations");
var rides = require("./apis/rides");

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
		text += "`getstocks` to display the current stats for saved stocks\n";
		text += "`getnews` to get a list of the top 10 NY Times articles\n";
		text += "`setaddress [address1] [address2]` to set a start and end address\n";
		text += "`getroute` to see Google's estimated travel time and distance\n";
		text += "`getride` to see Uber's esimated rates and times";

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

		if (messageText.indexOf("setaddress") >= 0) {

			locations.setRoute(messageText);

			ws.send(JSON.stringify({
			    "id": id,
			    "type": "message",
			    "channel": "C2750K0GY",
			    "text": "Thanks! I've set your start and end address."
			}));
			id += 1;
		}

		if (messageText === "getroute") {

			locations.getRoute().then(function(data) {

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

			var text1 = "";
			var text2 = "";

			locations.getGeo().then(function(geoData) {

				rides.getTimes(geoData).then(function(timeData){
					
					text1 += "An uberPool is *" + timeData.times[0].estimate / 60 + "m* away ";
					text2 += "An uberX is *"+ timeData.times[1].estimate / 60 + "m* away ";
					
					rides.getPrice(geoData).then(function(priceData){

						text1 += "and would cost *" + priceData.prices[0].estimate + "*\n";
						text2 += "and would cost *" + priceData.prices[1].estimate + "*";

						ws.send(JSON.stringify({
						    "id": id,
						    "type": "message",
						    "channel": "C2750K0GY",
						    "mrkdwn": true,
						    "text": text1 + text2
						}));
						id += 1;
					}, function(error){
						console.log(error)
					});
				}, function(error) {
					console.log(error)
				});
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