'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Episode = mongoose.model('Episode');

/**
 * Globals
 */
var user, episode;

/**
 * Unit tests
 */
describe('Episode Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      episode = new Episode({
        name: 'Episode Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return episode.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      episode.name = '';

      return episode.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Episode.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
