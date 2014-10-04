#!/usr/bin/env node

var util = require('util');
var twitter = require('twitter');
var config = require('config');
var _ = require('lodash');

var twit = new twitter(config.creds.twitter);

var tags = {};
var total = 0;
setInterval(function() {
  var res = _.pairs(tags).sort(function(p1, p2) { return p2[1] - p1[1]; });
  console.log(_.take(res, 10));
}, 1000);

function sample(cb) {
  twit.stream('statuses/sample', function(stream) {
    stream.on('data', cb);
  });
}

function location(cb) {
  twit.stream('statuses/filter', {locations: ['-180,-90,180,90']}, function(stream) {
    stream.on('data', cb);
  });
}

location(function(data) {
  if (!data.delete) {
    ++total;

    var terms = (data.text || '').split(/\s+/g).filter(function(t) { return t.length > 0 && t[0] === '#'; }).map(function(t) { return t.toLowerCase(); });
    terms.forEach(function(term) {
      var count = tags[term] || 0;
      tags[term] = count + 1;
    });
  }
});
