var express = require("express");
var Tab = require("./app/tab");
var db = require("./app/config/db");
var Thing = require("./app/models/thing");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("express-flash");

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

function findThingById(req, res, next){
    res.locals.activePath = "/things";
    res.locals.title = "Add A New Thing";
    if(req.params.id){
        Thing.findById(req.params.id, function(err, thing){
               if(err)
                    next(err);
               else{
                   res.locals.thing = thing; 
                   res.locals.title = "Editing " + thing.name;
                   next();
               }
            });
    }
    else{
        res.locals.thing = new Thing(); 
        next();
    }
        
}

app.get("/things", function(req, res){
    Thing.find({}).then(function(things){
       res.render("things", {
           title: "Things",
           activePath: "/things",
           things: things
       });
    });
});

app.post("/things/new", function(req, res){
   var thing = new Thing(req.body); 
   thing.save(function(err){
       if(!err){
         req.flash("info", "A thing with an id of " + thing._id + " has been inserted");
         res.redirect("/things"); 
       }
       else{
            res.render("thing", {
                thing: new Thing(),
                activePath: "/things",
                title: "Insert a New Thing",
                error: err
            });
       }
    });
});

app.post("/things/:id/delete", function(req, res, next){
    Thing.remove({_id: req.params.id})
        .then(function(){
            req.flash("info", "A thing has been deleted")
            res.redirect("/things");
        });
    
});
app.post("/things/:id", findThingById, function(req, res){
            var thing = res.locals.thing;
            thing.name = req.body.name;
            thing.save(function(err, _thing){
                if(!err){
                    req.flash("info", "A Thing with the name " + thing.name + " has been saved");
                    res.redirect("/things"); 
                }
                else {
                    res.render("thing", {
                       error: err,
                       thing: thing,
                       title: "Thing " + thing.name
                    });  
                }
            });
});

app.get("/things/new", findThingById, function(req, res){
    res.render("thing");
    
});
app.get("/things/:id", findThingById, function(req, res){
    res.render("thing");  
});

app.listen(process.env.PORT);