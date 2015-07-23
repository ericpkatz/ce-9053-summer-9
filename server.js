var express = require("express");
var Tab = require("./app/tab");
var db = require("./app/config/db");
var Thing = require("./app/models/thing");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("express-flash");

var thingsRouter = require("./app/routers/things")

db.connect()
    .then(function(){
        console.log("connected");
    })
    .catch(function(err){
        console.log(err);
    });


var app = express();
app.locals.pretty = true;
app.set("view engine", "jade");

app.use(express.static(__dirname + "/public"));

app.use(cookieParser("my secret"));
app.use(session({cookie: {  }}));
app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
    res.locals.tabs = [
            new Tab("Home", "/"),
            new Tab("People", "/people"),
            new Tab("Things", "/things")
    ];
    next(); 
});


app.get("/", function(req, res){
   res.render("index", {
       title: "Home",
       activePath: "/"
   });
});
app.get("/people", function(req, res){
   res.render("people", {
       title: "People",
       activePath: "/people"
   });
});

app.use("/things", thingsRouter);


app.listen(process.env.PORT);