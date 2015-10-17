var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
		username: String,
	    pseudo: String,
	    password: String,
	    day: Number,
	    month: Number,
	    year: Number,
	    country: String,
	    gender: String,
	    profil: String,
	    audio: [{
	    	title: String,
	    	isPrivate: Boolean,
	    	uploadDate: {type: Date},
	    	caption: String,
	    	playBy: [{
	    		username:String
	    	}],
	    	like: [{
	    		username: String
	    	}],
	    	pin: [{
	    		username: String
	    	}]
    	}]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);