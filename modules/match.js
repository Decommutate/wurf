var https = require('https');
var querystring = require('querystring');
var apikey = require('../modules/apikey');
var matches = require('../modules/matches');
var matchFilter = require('../modules/matchFilter');

var cachedMatch = null;

var refreshMatch = function() {
    var recentMatches = matches.getRecentMatches();

    console.log("Getting new match");
    if (matches !== null) {
        var matchId = recentMatches.shift();

        var parameters = {
            api_key: apikey.getApiKey(),
            includeTimeline: "true"
        };
        var options = {
            host: 'na.api.pvp.net',
            path: '/api/lol/na/v2.2/match/' + matchId + '?' + querystring.stringify(parameters),
            method: 'GET'
        };

        https.request(options, function(res) {
            var fullBody = "";
            res.on("data", function(chunk) {
                fullBody += chunk;
            }).on("end", function() {
                cachedMatch = matchFilter.filterMatch(JSON.parse(fullBody));
            });
        }).on("error", function(error) {
            console.log("An error has occurred getting a recent match");
            console.log(error);
        }).end();

        console.log("Now serving match id: " + matchId);
    }
};

setInterval(refreshMatch, 20000);

var getRecentMatch = function() {
    return cachedMatch;
};

module.exports.getRecentMatch = getRecentMatch;