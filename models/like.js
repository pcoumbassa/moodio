var mongoose = require('mongoose');
var Schema = mongoose.Schema();

var Like = new Schema({
	username: String,
	audioTitle: String,
	likeDate: {type: Date}
});

module.exports = mongoose.model('Like', Like);