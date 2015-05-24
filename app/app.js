var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mailin = require('mailin');
var fs = require('fs');
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cha');

var User = require('./types/user');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Now connected to database');
});

var routes = require('./routes/index');
var users = require('./routes/users');

var accessKey = fs.readFileSync('/home/ubuntu/accessKey.txt').toString().trim();
var secretKey = fs.readFileSync('/home/ubuntu/secretKey.txt').toString().trim();

console.log(accessKey);
console.log(secretKey);

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(ses({
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
        region: 'us-west-2'
    })
);

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mailin.start({
  port: 25,
  disableWebhook: true // Disable the webhook posting.
});

/* Access simplesmtp server instance. */
mailin.on('authorizeUser', function(connection, username, password, done) {
  /*
  if (username == "johnsmith" && password == "mysecret") {
    done(null, true);
  } else {
    done(new Error("Unauthorized!"), false);
  }
  */

  //TODO
});

/* Event emitted when a connection with the Mailin smtp server is initiated. */
mailin.on('startMessage', function (connection) {
  /* connection = {
      from: 'sender@somedomain.com',
      to: 'someaddress@yourdomain.com',
      id: 't84h5ugf',
      authentication: { username: null, authenticated: false, status: 'NORMAL' }
  }
  }; */
  console.log(connection);
});

/* Event emitted after a message was received and parsed. */
mailin.on('message', function (connection, data, content) {
  console.log(data);
  console.log(data.text.length);
  console.log(data.from[0].address);
  console.log(data.to[0].address);
  console.log(data.text);

  User.findOne({ "internalEmail" : data.to[0].address }, function(err, recipient) {
    var mailOptions;
    if(err) {
      //Send email not found error
      console.log("Error : ");
      console.log(err);
      console.log("Recipient : ");
      console.log(recipient);
      mailOptions = {
        html: "Terribly sorry, but that email doesn't exist. <br><br>Regards,<br>The Management"
      };
      mailOptions.headers = {
        from: '<'.concat('postmaster@gocha.io').concat('>'),
        to : '<'.concat(data.from[0].address).concat('>'),
        subject: "Address Error",
        contentType: 'text/plain',
      };
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(mailOptions);
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
      });
    } else if(data.text.length > 141){
      //Send email too long error
      console.log("Email length too long");
      mailOptions = {
        html: "Character count for your email was too long.  Current count is: " + data.text.length + "<br><br>Regards,<br>The Management"
      };
      mailOptions.headers = {
        from: '<'.concat('postmaster@gocha.io').concat('>'),
        to : '<'.concat(data.from[0].address).concat('>'),
        subject: "Length Error",
        contentType: 'text/plain',
      };
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(mailOptions);
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
      });
    } else {
      //Check if sender exists
      User.findOne({ externalEmail : data.from[0].address }, function(err, sender) {
        if(err || !sender){
          //User does not exist, so we need to make an email for them
          var newUser = new User({
            externalEmail: data.from[0].address
          });
          newUser.generateEmail(function(res, success){
            if(!success){
              console.log("Failed to generate email");
              //possibly send email saying all emails have been taken
            } else {
              console.log("Added new user");
              console.log("Returned data from generate in app scope : ");
              console.log(res);
              res.save(function(err){
                if(err) {
                  console.log("Unable to save new user");
                  throw err;
                } else {
                  console.log("New user saved");
                  //Now, we can pass along the message
                  mailOptions = {
                    text: data.text
                  }
                  mailOptions.headers = {
                    from: '<'.concat(res.internalEmail).concat('>'),
                    to : '<'.concat(recipient.externalEmail).concat('>'),
                    subject: data.subject,
                    contentType: 'text/plain',
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(mailOptions);
                        console.log(error);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                  });
                }
              });
            }
          })
        } else {
          //Sender already exists, pass along the message just fine
          console.log("Sender : ");
          console.log(sender);
          console.log("Recipient : ");
          console.log(recipient);
          mailOptions = {
            text: data.text
          };
          mailOptions.headers = {
            from: '<'.concat(sender.internalEmail).concat('>'),
            to : '<'.concat(recipient.externalEmail).concat('>'),
            subject: data.subject,
            contentType: 'text/plain',
          };
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(mailOptions);
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
          });
        }
      });
    }
  });
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*
var testUser = new User({
  externalEmail : 'vanhooser@ou.edu',
  internalEmail : 'gloriousLeader@gocha.io'
});

testUser.save(function(err){
  if(err) {
    throw err;
  } else {
    console.log("Added test user");
  }
});
*/

module.exports = app;

app.listen(80);