var Q = require("q");
var mongoose = require("mongoose");

var connectionString = "mongodb://foo:bar@ds043917.mongolab.com:43917/ce-9053-summer-9";

module.exports = {
    connect: connect
};

function connect(){
    var dfd = Q.defer();
    //mongoose.connect("mongodb://localhost:27017/my_world"); 
    mongoose.connect(connectionString);
    mongoose.connection.on("open", function(){
        dfd.resolve();
    });
    mongoose.connection.on("error", function(err){
        dfd.reject(err);
    });
    return dfd.promise;
}