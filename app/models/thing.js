var mongoose = require("mongoose");

var thingSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true }
});

var Thing = mongoose.model("thing", thingSchema);

module.exports = Thing;