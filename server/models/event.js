'use strict';

var Mongo = require('mongodb'),
    async = require('async'),
    underscore = require('underscore');

function Occasion(o){
 /* this.name       = o.name;
  this.locationId = Mongo.ObjectID(o.locationId);
  this.type       = o.type;
  this.attendees  = [];
  this.date       = new Date(o.date);*/
}

Object.defineProperty(Occasion, 'collection', {
  get: function(){return global.mongodb.collection('events');}
});

Occasion.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Occasion.collection.findOne({_id:_id}, cb);
};

Occasion.mapRsvps = function(array, cb){
  async.map(array, attachEvent, function(err, array){
    cb(null, array);
  });
};

Occasion.retrieve = function(userId, eventId, cb){
  Occasion.findById(eventId, function(err, occasion){
    var rsvp = RSVP(occasion.attendees, userId);
    occasion.attendees = occasion.attendees || [];
    async.map(occasion.attendees, iterator.bind(userId), function(err, attendees){
      occasion.attendees = attendees;
      cb(null, occasion, rsvp);
    });
  });
};

Occasion.all = function(cb){
  Occasion.collection.find().toArray(cb);
};

Occasion.rsvp = function(userId, eventId, cb){
  var User = require('./user');
  Occasion.findById(eventId, function(err, occasion){
    var rsvp = RSVP(occasion.attendees, userId);

    if(rsvp === true){
      occasion.attendees = underscore.without(occasion.attendees, userId);
    }else{
      occasion.attendees.push(userId);
    }
    Occasion.collection.save(occasion, function(){
      User.rsvp(userId, eventId, function(){
        cb(null, !rsvp);
      });
    });
  });
};


module.exports = Occasion;

//HELPER FUNCTIONS

function iterator(attendee, cb){
  var User = require('./user');

  if(attendee.toString() === this.toString()){cb(); return;}
  User.findById(attendee, function(err, user){
    var info = {
      _id  : user._id,
      name : user.name
    };

    cb(null, info);
  });
}

function attachEvent(id, cb){
  var Location = require('./location');

  Occasion.findById(id, function(err, obj){
    Location.findById(obj.locationId, function(err, loc){
      var occasion = {
        _id: obj._id,
        name: obj.name,
        date: {
          date: obj.dates[0].date,
          startTime: obj.dates[0].startTime
        },
        loc: loc.title
      };

      cb(null, occasion);
    });
  });
}

function RSVP(array, userId){
  if(!underscore.find(array, function(id){
    return id === userId;
  })){
    return false;
  }else{
    return true;
  }
}
