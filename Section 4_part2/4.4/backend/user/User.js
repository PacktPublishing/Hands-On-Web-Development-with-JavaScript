var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.statics.authenticate = function(userid, password, cb) {
  this.find({userid: userid}, function(err, users) {
    if(err) {
      cb(err);
    }
    else if(users.length > 0){
      var user = users.pop();
      bcrypt.compare(password, user.password, cb);
    }
    else {
      cb(err, false);
    }
  });
};

UserSchema.statics.details = function(condition) {
  return this.find(condition, '-_id userid name location dob');
};

var userModel = mongoose.model('User', UserSchema);

userModel.find({}, function (err, users) {
  if (err) return console.log("There was a problem finding the users.");
  if (users.length === 0) {
    (new userModel({ userid: "admin", name: "Super Admin", password: "abc123", location: "Bangalore", dob: new Date(1992, 1, 12) })).save();
  }
});

module.exports = userModel;