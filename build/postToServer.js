var http = require('http');
HOST = "bluefish.cs.unc.edu";
PORT = 3131;
name = "test";
highScore = 5000;

//function postToServer(name, highScore) {
    var user = {
        username: name,
        score: highScore
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
    var req = http.request(options); /*, function (res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            var resultObject = JSON.parse(responseString);
        });
    });

    req.on('error', function (e) {
        // TODO: handle error.
    }); */

    req.write(userString);
    req.end();

//}