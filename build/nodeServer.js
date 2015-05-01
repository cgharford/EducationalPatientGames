var http = require("http");
var qs = require("querystring");
var port = process.argv[2];  //pass the port number as first argument in the command line
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var ClientStream = require("ClientStream");
var DATABASENAME = "educational_patient_games";
var COLLECTIONNAME = "captain_safety";
var GETLIMIT = 20; //limit to number of scores returned in response to GET request
var url = "mongodb://localhost:27017/" + DATABASENAME;

var server = http.createServer(function(request, response) {
    //POST - create record
    //GET - read record
    //PUT - update record
    //DELETE - delete record
    var body = '';
    if (request.method === "POST") {
        //create a new record
        request.on('data', function(data) {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function() {
            var obj = JSON.parse(body);
            console.log("---creating new record in database---");
            console.log("username of " + obj.username);
            console.log("score of " + obj.score);
            console.log("date of " + obj.date);
            console.log(obj);
            MongoClient.connect(url, function (err, db) {
                if (err) {
                    console.log(err);
                    db.close();
                    response.end();
                }
                else {
                    console.log("connected to mongo, database: + " + DATABASENAME);
                    var collection = db.collection(COLLECTIONNAME);
                    insertDocuments(db, collection, obj, response);
                }
            });
        });
    }
    else if (request.method === "GET") {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
                db.close();
                response.end();
            }
            else {
                console.log("connect to mongo, database: " + DATABASENAME);
                var collection = db.collection(COLLECTIONNAME);
                retrieveDocuments(db, collection, response);
            }
        })
    }
    else {
        //case of a PUT or DELETE, still need to respond
        response.write("Server does not support the given HTTP method")
        response.end();
    }
    });
server.listen(port);
console.log("Server ready");

function insertDocuments(db, collection, data, response) {
    collection.insertOne(data, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        db.close();
        console.log("record written successfully and connection closed");
        response.end();
    })
}

function retrieveDocuments(db, collection, response) {
    var myDate = new Date();
    collection.find({date: (myDate.getMonth()+1) + " " + myDate.getDate() + " " + myDate.getFullYear()},
        {username: true, score: true},
        { limit: GETLIMIT }).toArray(function (err, data) {
            var body = JSON.stringify(data);
            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            });
            console.log("The following records successfully retrieved at " + myDate.getHours() + ":" +
            myDate.getMinutes() + ":" + myDate.getSeconds() + " on " +
            (myDate.getMonth()+1) + " " + myDate.getDate() + " " + myDate.getFullYear() + "\n"
            + JSON.stringify(data));
            response.write(JSON.stringify(data));
            response.end();
            db.close();
        });
}