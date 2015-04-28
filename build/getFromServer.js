module.exports = function() {

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
    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            try {
                var resultObject = JSON.parse(responseString);
                console.log(resultObject);
                //result object are the retrieved records in JSON format
                //TODO:  display the given names/scoress somewhere on the client side
                //here is how you can iterate over the scores
                for (i = 0; i < resultObject.length; i++) {
                    console.log("name: " + resultObject[i].username + ", score: " + resultObject[i].score);
                }
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

//}
}