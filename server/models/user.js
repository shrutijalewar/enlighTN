'use strict';

var bcrypt     = require('bcrypt'),
    Mongo      = require('mongodb'),
    Occasion   = require('./event'),
    Location   = require('./location'),
    Reflection = require('./reflection'),
    underscore = require('underscore');

function User(o){
  this._id = o._id || Mongo.ObjectID();
  this.email = o.email;
  this.name = o.name || 'Please Add';
  this.password = o.password;
  this.favoriteLocations = [];
  this.RSVP = [];
  this.upVote = [];
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, cb);
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user || o.password.length < 3){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(new User(o), cb);
  });
};

User.login = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(null, user);
  });
};

User.save = function(o, cb){
  User.collection.save(o, cb);
};

User.update = function(id, o, cb){
  var _id = Mongo.ObjectID(id);

  console.log(_id, o.name, o.email);
  User.collection.findAndModify({_id:_id}, {}, {$set: {name: o.name, email: o.email}}, function(a, b, c){
    cb();
  });
};

User.getUserData = function(id, cb){
  User.findById(id, function(err, user){
    delete user.password;
    Occasion.mapRsvps(user.RSVP, function(err, RSVP){
      user.RSVP = RSVP;
      Location.mapFav(user.favoriteLocations, function(err, favs){
        user.favoriteLocations = favs;
        Reflection.findAllByUserId(user._id, function(err, reflects){
          Location.mapLoc(reflects, function(err, reflects){
            user.reflections = reflects;
            cb(null, user);
          });
        });
      });
    });
  });
};

User.favoriteLoc = function(userId, locId, cb){
  User.findById(userId, function(err, user){
    if(!underscore.find(user.favoriteLocations, function(id){
      return id === locId;
    })){
      user.favoriteLocations.push(locId);
    }else{
      user.favoriteLocations = underscore.without(user.favoriteLocations, locId);
    }
    User.collection.save(user,cb);
  });
};

User.rsvp = function(userId, eventId, cb){
  User.findById(userId, function(err, user){
    if(!underscore.find(user.RSVP, function(id){
      return id === eventId;
    })){
      user.RSVP.push(eventId);
    }else{
      user.RSVP = underscore.without(user.RSVP, eventId);
    }
    User.collection.save(user,cb);
  });
};


module.exports = User;
