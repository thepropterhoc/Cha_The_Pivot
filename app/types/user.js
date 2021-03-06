// grab the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Email = require('./email');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
	externalEmail : { type : String, default: "None"},
	internalEmail : { type : String, default: "None"},
	accountType : { type : Number, default: 0},
	passwordHash : { type : String, default : "None" },
	firstName : { type : String, default : "None" },
	lastName : { type : String, default : "None" }
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

userSchema.methods.generateEmail = function(callback) {
	var _this = this;
	Email.findOne({"taken" : false}, function(err, email){
		if(err){
			callback(error, false);
			return;
		}
		console.log("Find email returned : ");
		console.log(email);
		console.log("Found untaken email : ");
		console.log(email.email);
		_this.internalEmail = email.email;
		
		Email.findOneAndUpdate({email : email.email}, {taken : true}, function(err, user){
			if(err){
				throw err;
			} else {
				console.log("Saved email as being taken");
				console.log("Returned value from update : ");
				console.log(user);
				console.log("Email in inner scope is : ");
				console.log(email.email);
				callback(_this, true);
			}
		});
		
	});
}

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;