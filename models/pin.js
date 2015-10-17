var mongoose = require('mongoose');
var Schema = mongoose.Schema();

var Pin = new Schema({
	username: String,
	audioTitle: String,
	pinDate: {type: Date}
});

module.exports = mongoose.model('Pin', Pin);