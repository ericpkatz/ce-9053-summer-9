var Q = require("q");
var mongoose = require("mongoose");

var connectionString = "mongodb://localhost:27017/my_world";
if(process.env.PROD)
    connectionString = "mongodb://" + process.env.USERNAME + ":" + process.env.PW + "@ds043917.mongolab.com:43917/ce-9053-summer-9";

module.exports = {
    connect: connect
};

function connect(){
    var dfd = Q.defer();
    mongoose.connect(connectionString);
    mongoose.connection.on("open", function(){
        dfd.resolve();
    });
    mongoose.connection.on("error", function(err){
        dfd.reject(err);
    });
    return dfd.promise;
}