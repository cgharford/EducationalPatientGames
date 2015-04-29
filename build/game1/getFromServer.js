module.exports = function() {
    var http = require('http');
    HOST = "bluefish.cs.unc.edu";
    PORT = 3130;
    var resultObject = "";

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

        var result = res.on('end', function () {
            try {
                resultObject = JSON.parse(responseString);
                console.log(resultObject);
                //result object are the retrieved records in JSON format
                //here is how you can iterate over the scores
                /* for (i = 0; i < resultObject.length; i++) {
                    console.log("name: " + resultObject[i].username + ", score: " + resultObject[i].score);
                } */
                //return resultObject;
            }
            catch (err) {
                console.log(err);
                return null;
            }
        });
        //return result;
    });

    req.on('error', function (e) {
        // TODO: handle error.
    });

    req.end();
    return resultObject;

//}
};