// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var emailSchema = new Schema({
	email : {type : String, default : "None"},
	taken : {type : Boolean, default: false },
	owner : {type : ObjectID}
});

// the schema is useless so far
// we need to create a model using it
var Email = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = Email;