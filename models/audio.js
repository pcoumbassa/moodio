var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Audio = new Schema({
    username: String,
    pseudo: String,
    title: String,
    isPrivate: Boolean,
    caption: String,
    dope: Number,
    listening: Number
});

module.exports = mongoose.model('Audio', Audio);