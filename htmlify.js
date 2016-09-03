"use strict";

module.exports = function(string) {

	var htmlString = "";

	for (var i = 0; i < string.length; i++) {

		if (string.charAt(i) === "&") {
			htmlString += "&amp;";
		} else if (string.charAt(i) === "<") {
			htmlString += "&lt;";
		} else if (string.charAt(i) === ">") {
			htmlString += "&gt;";
		} else {
			htmlString += string.charAt(i);
		}
	}
	return htmlString;
}