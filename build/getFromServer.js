var http = require('http');
HOST = "bluefish.cs.unc.edu";
PORT = 3131;


var headers = {
    'Content-Type': 'application/json'
};

var options = {
    host: HOST,
    port: PORT,
    path: '/',
    method: 'GET',
    headers: headers
};

// Setup the request.  The options parameter is
// the object we defined above.
var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function (data) {
        responseString += data;
    });

    res.on('end', function () {
        try {
            var resultObject = JSON.parse(responseString);
            console.log(resultObject);
        }
        catch (err) {
            console.log(err);
        }
        //TODO:  This is where you can receive the scores from the database and do whatever you need to with them
        //the database will return score records in response to a GET request
        //to ask for scores posted on april 19, 2015 the mongo query looks like
        //db.captain_safety.find({date: "4 19 2015"})
    });
});

req.on('error', function (e) {
    // TODO: handle error.
});

req.end();

//}