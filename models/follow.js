var mongoose = require('mongoose');
var Schema = mongoose.Schema();

var Follow = new Schema({
	followerName: String,
	followingName: String,
	followDate: {type: Date}
});

module.exports = mongoose.model('Follow', Follow);