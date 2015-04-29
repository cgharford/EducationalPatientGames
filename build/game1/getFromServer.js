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

// Setup the request.  The options parameter is
// the object we defined above.
    var req = http.request(options, function (res) {
        //res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            try {
                result = JSON.parse(responseString);
                resultObject.string1 = result[1].username + ": " + result[1].score;
                //result object are the retrieved records in JSON format
                //here is how you can iterate over the scores
                //for (i = 0; i < resultObject.length; i++) {
                  //  console.log("name: " + resultObject[i].username + ", score: " + resultObject[i].score);
                //};

            }
            catch (err) {
                console.log(err);
      //          return null;
            }
        });
        //return resultObject;
        //console.log(responseString);
    });

    req.on('error', function (e) {
        // TODO: handle error.
    });

    req.end();
    //return resultObject;

    //wait 500 ms (not that good..)
    var date = new Date();
    var curDate = new Date()
    while (true) {
        if (curDate - date < 1000) {
            curDate = new Date();
        }
        else {
            console.log(resultObject);
            break;
        }
    }
};