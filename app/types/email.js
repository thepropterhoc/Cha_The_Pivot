// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var emailSchema = new Schema({
	email : {type : String, default : "None"},
	taken : {type : Boolean, default: false },
	owner : {type : Schema.Types.ObjectId}
});

// the schema is useless so far
// we need to create a model using it
var Email = mongoose.model('Email', emailSchema);

// make this available to our users in our Node applications
module.exports = Email;