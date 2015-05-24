// grab the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
	externalEmail : String,
	internalEmail : String,
	accountType : Number,
	passwordHash : String,
	firstName : String,
	lastName : String
});

// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users 
userSchema.methods.authenticate = function(checkPass) {
  // add some stuff to the users name
 bcrypt.compare(checkPass, this.passwordHash, function(err, res){
 	return res;
 });
};

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;