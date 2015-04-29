module.exports = function(game, textStyle) {
    var http = require('http');
    HOST = "bluefish.cs.unc.edu";
    PORT = 3131;
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
    var resultObject = '';
    var req = http.request(options, resultObject, function (res) {
        //res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            try {
                resultObject = JSON.parse(responseString);
                //result object are the retrieved records in JSON format
                //here is how you can iterate over the scores
                for (i = 0; i < resultObject.length; i++) {
                    console.log("name: " + resultObject[i].username + ", score: " + resultObject[i].score);
                };

                var string1 = "" + resultObject[i].username + ": " + resultObject[i].score;
                var text1 = this.game.add.text(500,190,string1, textStyle);
                text1.visible = true;
                var text2 = this.game.add.text(0,0," THIS IS A TEST", textStyle);
                text2.visible = true;
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

//}
};