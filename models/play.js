var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Play = new Schema({
	username: String,
	title: String,
	playDate: {type: Date}
});

module.exports = mongoose.model('Play', Play);