'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Episode = mongoose.model('Episode'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, episode;

/**
 * Episode routes tests
 */
describe('Episode CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Episode
    user.save(function () {
      episode = {
        name: 'Episode name'
      };

      done();
    });
  });

  it('should be able to save a Episode if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(200)
          .end(function (episodeSaveErr, episodeSaveRes) {
            // Handle Episode save error
            if (episodeSaveErr) {
              return done(episodeSaveErr);
            }

            // Get a list of Episodes
            agent.get('/api/episodes')
              .end(function (episodesGetErr, episodesGetRes) {
                // Handle Episode save error
                if (episodesGetErr) {
                  return done(episodesGetErr);
                }

                // Get Episodes list
                var episodes = episodesGetRes.body;

                // Set assertions
                (episodes[0].user._id).should.equal(userId);
                (episodes[0].name).should.match('Episode name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Episode if not logged in', function (done) {
    agent.post('/api/episodes')
      .send(episode)
      .expect(403)
      .end(function (episodeSaveErr, episodeSaveRes) {
        // Call the assertion callback
        done(episodeSaveErr);
      });
  });

  it('should not be able to save an Episode if no name is provided', function (done) {
    // Invalidate name field
    episode.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(400)
          .end(function (episodeSaveErr, episodeSaveRes) {
            // Set message assertion
            (episodeSaveRes.body.message).should.match('Please fill Episode name');

            // Handle Episode save error
            done(episodeSaveErr);
          });
      });
  });

  it('should be able to update an Episode if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(200)
          .end(function (episodeSaveErr, episodeSaveRes) {
            // Handle Episode save error
            if (episodeSaveErr) {
              return done(episodeSaveErr);
            }

            // Update Episode name
            episode.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Episode
            agent.put('/api/episodes/' + episodeSaveRes.body._id)
              .send(episode)
              .expect(200)
              .end(function (episodeUpdateErr, episodeUpdateRes) {
                // Handle Episode update error
                if (episodeUpdateErr) {
                  return done(episodeUpdateErr);
                }

                // Set assertions
                (episodeUpdateRes.body._id).should.equal(episodeSaveRes.body._id);
                (episodeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Episodes if not signed in', function (done) {
    // Create new Episode model instance
    var episodeObj = new Episode(episode);

    // Save the episode
    episodeObj.save(function () {
      // Request Episodes
      request(app).get('/api/episodes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Episode if not signed in', function (done) {
    // Create new Episode model instance
    var episodeObj = new Episode(episode);

    // Save the Episode
    episodeObj.save(function () {
      request(app).get('/api/episodes/' + episodeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', episode.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Episode with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/episodes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Episode is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Episode which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Episode
    request(app).get('/api/episodes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Episode with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Episode if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(200)
          .end(function (episodeSaveErr, episodeSaveRes) {
            // Handle Episode save error
            if (episodeSaveErr) {
              return done(episodeSaveErr);
            }

            // Delete an existing Episode
            agent.delete('/api/episodes/' + episodeSaveRes.body._id)
              .send(episode)
              .expect(200)
              .end(function (episodeDeleteErr, episodeDeleteRes) {
                // Handle episode error error
                if (episodeDeleteErr) {
                  return done(episodeDeleteErr);
                }

                // Set assertions
                (episodeDeleteRes.body._id).should.equal(episodeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Episode if not signed in', function (done) {
    // Set Episode user
    episode.user = user;

    // Create new Episode model instance
    var episodeObj = new Episode(episode);

    // Save the Episode
    episodeObj.save(function () {
      // Try deleting Episode
      request(app).delete('/api/episodes/' + episodeObj._id)
        .expect(403)
        .end(function (episodeDeleteErr, episodeDeleteRes) {
          // Set message assertion
          (episodeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Episode error error
          done(episodeDeleteErr);
        });

    });
  });

  it('should be able to get a single Episode that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Episode
          agent.post('/api/episodes')
            .send(episode)
            .expect(200)
            .end(function (episodeSaveErr, episodeSaveRes) {
              // Handle Episode save error
              if (episodeSaveErr) {
                return done(episodeSaveErr);
              }

              // Set assertions on new Episode
              (episodeSaveRes.body.name).should.equal(episode.name);
              should.exist(episodeSaveRes.body.user);
              should.equal(episodeSaveRes.body.user._id, orphanId);

              // force the Episode to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Episode
                    agent.get('/api/episodes/' + episodeSaveRes.body._id)
                      .expect(200)
                      .end(function (episodeInfoErr, episodeInfoRes) {
                        // Handle Episode error
                        if (episodeInfoErr) {
                          return done(episodeInfoErr);
                        }

                        // Set assertions
                        (episodeInfoRes.body._id).should.equal(episodeSaveRes.body._id);
                        (episodeInfoRes.body.name).should.equal(episode.name);
                        should.equal(episodeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Episode.remove().exec(done);
    });
  });
});
