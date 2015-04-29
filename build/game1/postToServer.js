
module.exports = function(userName, userScore) {

    var http = require('http');
    HOST = "localhost";
    PORT = 3131;
    name = userName;
    highScore = userScore;
    var myDate = new Date();

//function postToServer(name, highScore) {
    var user = {
        username: name,
        score: highScore,
        date: (myDate.getMonth() + 1) + " " + myDate.getDate() + " " + myDate.getFullYear()
    };

    var userString = JSON.stringify(user);

    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': userString.length
    };

    var options = {
        host: HOST,
        port: PORT,
        path: '/',
        method: 'POST',
        headers: headers
    };

// Setup the request.  The options parameter is
// the object we defined above.
    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            //var resultObject = JSON.parse(responseString);
            console.log(responseString);
            //TODO:  This is where you can receive the scores from the database and do whatever you need to with them
            //the database will return score records in response to a GET request
            //to ask for scores posted on april 19, 2015 the mongo query looks like
            //db.captain_safety.find({date: "4 19 2015"})
        });
    });

    req.on('error', function (e) {
        // TODO: handle error.
    });

    req.write(userString);
    req.end();


};