//mongo runs on port 27017, our database is called educational_patient_games and the collection for
//captain safety is captain_safety

var http = require("http");
var qs = require("querystring");
var port = process.argv[2];  //pass the port number as first argument in the command line
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var DATABASENAME = "educational_patient_games";
var COLLECTIONNAME = "captain_safety";
var url = "mongodb://localhost:27017/" + DATABASENAME;

var server = http.createServer(function(request, response) {
    //POST - create
    //GET - read
    //PUT - update
    //DELETE - delete
    var body = '';
    if (request.method === "POST") {
        //create a new record
        //post should just create a record and set score to 0
        request.on('data', function(data) {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function() {
            var obj = JSON.parse(body);
            console.log("creating new record in database");
            console.log("username of " + obj.username); //this is how you
            console.log("score of " + obj.score);
            console.log(obj);
            MongoClient.connect(url, function (err, db) {
                if (err) {
                    //stop the function
                }
                console.log("connected to mongo, database: + " + DATABASENAME);
                var collection = db.collection(COLLECTIONNAME);
                insertDocuments(collection, obj);
                db.close();
            });
        })
    }
    if (request.method === "GET") {
        //read a record
        request.on('data', function(data) {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function() {
            var post = qs.parse(body);
            console.log(post);
        })
    }
    if (request.method === "PUT") {
        //update existing record
    }
    if (request.method === "DELETE") {
        //delete a record
    }
    response.end("Hello");
    });
server.listen(port);
console.log("Server ready");

function insertDocuments(collection, data) {
    collection.insertOne(data, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
    })
}