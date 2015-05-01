var resultObject = {string1: "", string2: "", string3: "", string4: ""};

module.exports = function(game) {
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

// Setup the request.
    var req = http.request(options, function (res) {
        //res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            try {
                result = JSON.parse(responseString); //this is the JSON, how to get it out of the callback?
                resultObject.string1 = result[1].username + ": " + result[1].score;
                //here is how you can iterate over the scores
                /* for (i = 0; i < resultObject.length; i++) {
                  console.log("name: " + resultObject[i].username + ", score: " + resultObject[i].score);
                }; */

            }
            catch (err) {
                console.log(err);
            }
        });
    });

    req.on('error', function (e) {
        // TODO: handle error.
    });

    req.end();
};