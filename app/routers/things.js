var express = require("express");
var Thing = require("../models/thing");

var app = express.Router();

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

app.get("/", function(req, res){
    Thing.find({}).then(function(things){
       res.render("things", {
           title: "Things",
           activePath: "/things",
           things: things
       });
    });
});

app.post("/new", function(req, res){
   var thing = new Thing(req.body); 
    if(typeof req.body.active == 'undefined')
        thing.active = false;
    else
        thing.active = req.body.active;
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

app.post("/:id/delete", function(req, res, next){
    Thing.remove({_id: req.params.id})
        .then(function(){
            req.flash("info", "A thing has been deleted")
            res.redirect("/things");
        });
    
});
app.post("/:id", findThingById, function(req, res){
            var thing = res.locals.thing;
            thing.name = req.body.name;
            if(typeof req.body.active == 'undefined')
                thing.active = false;
            else
                thing.active = req.body.active;
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

app.get("/new", findThingById, function(req, res){
    res.render("thing");
    
});
app.get("/:id", findThingById, function(req, res){
    res.render("thing");  
});

module.exports = app;