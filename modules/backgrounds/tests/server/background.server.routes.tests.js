'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Background = mongoose.model('Background'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, background;

/**
 * Background routes tests
 */
describe('Background CRUD tests', function () {

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

    // Save a user to the test db and create new Background
    user.save(function () {
      background = {
        name: 'Background name'
      };

      done();
    });
  });

  it('should be able to save a Background if logged in', function (done) {
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

        // Save a new Background
        agent.post('/api/backgrounds')
          .send(background)
          .expect(200)
          .end(function (backgroundSaveErr, backgroundSaveRes) {
            // Handle Background save error
            if (backgroundSaveErr) {
              return done(backgroundSaveErr);
            }

            // Get a list of Backgrounds
            agent.get('/api/backgrounds')
              .end(function (backgroundsGetErr, backgroundsGetRes) {
                // Handle Background save error
                if (backgroundsGetErr) {
                  return done(backgroundsGetErr);
                }

                // Get Backgrounds list
                var backgrounds = backgroundsGetRes.body;

                // Set assertions
                (backgrounds[0].user._id).should.equal(userId);
                (backgrounds[0].name).should.match('Background name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Background if not logged in', function (done) {
    agent.post('/api/backgrounds')
      .send(background)
      .expect(403)
      .end(function (backgroundSaveErr, backgroundSaveRes) {
        // Call the assertion callback
        done(backgroundSaveErr);
      });
  });

  it('should not be able to save an Background if no name is provided', function (done) {
    // Invalidate name field
    background.name = '';

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

        // Save a new Background
        agent.post('/api/backgrounds')
          .send(background)
          .expect(400)
          .end(function (backgroundSaveErr, backgroundSaveRes) {
            // Set message assertion
            (backgroundSaveRes.body.message).should.match('Please fill Background name');

            // Handle Background save error
            done(backgroundSaveErr);
          });
      });
  });

  it('should be able to update an Background if signed in', function (done) {
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

        // Save a new Background
        agent.post('/api/backgrounds')
          .send(background)
          .expect(200)
          .end(function (backgroundSaveErr, backgroundSaveRes) {
            // Handle Background save error
            if (backgroundSaveErr) {
              return done(backgroundSaveErr);
            }

            // Update Background name
            background.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Background
            agent.put('/api/backgrounds/' + backgroundSaveRes.body._id)
              .send(background)
              .expect(200)
              .end(function (backgroundUpdateErr, backgroundUpdateRes) {
                // Handle Background update error
                if (backgroundUpdateErr) {
                  return done(backgroundUpdateErr);
                }

                // Set assertions
                (backgroundUpdateRes.body._id).should.equal(backgroundSaveRes.body._id);
                (backgroundUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Backgrounds if not signed in', function (done) {
    // Create new Background model instance
    var backgroundObj = new Background(background);

    // Save the background
    backgroundObj.save(function () {
      // Request Backgrounds
      request(app).get('/api/backgrounds')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Background if not signed in', function (done) {
    // Create new Background model instance
    var backgroundObj = new Background(background);

    // Save the Background
    backgroundObj.save(function () {
      request(app).get('/api/backgrounds/' + backgroundObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', background.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Background with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/backgrounds/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Background is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Background which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Background
    request(app).get('/api/backgrounds/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Background with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Background if signed in', function (done) {
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

        // Save a new Background
        agent.post('/api/backgrounds')
          .send(background)
          .expect(200)
          .end(function (backgroundSaveErr, backgroundSaveRes) {
            // Handle Background save error
            if (backgroundSaveErr) {
              return done(backgroundSaveErr);
            }

            // Delete an existing Background
            agent.delete('/api/backgrounds/' + backgroundSaveRes.body._id)
              .send(background)
              .expect(200)
              .end(function (backgroundDeleteErr, backgroundDeleteRes) {
                // Handle background error error
                if (backgroundDeleteErr) {
                  return done(backgroundDeleteErr);
                }

                // Set assertions
                (backgroundDeleteRes.body._id).should.equal(backgroundSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Background if not signed in', function (done) {
    // Set Background user
    background.user = user;

    // Create new Background model instance
    var backgroundObj = new Background(background);

    // Save the Background
    backgroundObj.save(function () {
      // Try deleting Background
      request(app).delete('/api/backgrounds/' + backgroundObj._id)
        .expect(403)
        .end(function (backgroundDeleteErr, backgroundDeleteRes) {
          // Set message assertion
          (backgroundDeleteRes.body.message).should.match('User is not authorized');

          // Handle Background error error
          done(backgroundDeleteErr);
        });

    });
  });

  it('should be able to get a single Background that has an orphaned user reference', function (done) {
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

          // Save a new Background
          agent.post('/api/backgrounds')
            .send(background)
            .expect(200)
            .end(function (backgroundSaveErr, backgroundSaveRes) {
              // Handle Background save error
              if (backgroundSaveErr) {
                return done(backgroundSaveErr);
              }

              // Set assertions on new Background
              (backgroundSaveRes.body.name).should.equal(background.name);
              should.exist(backgroundSaveRes.body.user);
              should.equal(backgroundSaveRes.body.user._id, orphanId);

              // force the Background to have an orphaned user reference
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

                    // Get the Background
                    agent.get('/api/backgrounds/' + backgroundSaveRes.body._id)
                      .expect(200)
                      .end(function (backgroundInfoErr, backgroundInfoRes) {
                        // Handle Background error
                        if (backgroundInfoErr) {
                          return done(backgroundInfoErr);
                        }

                        // Set assertions
                        (backgroundInfoRes.body._id).should.equal(backgroundSaveRes.body._id);
                        (backgroundInfoRes.body.name).should.equal(background.name);
                        should.equal(backgroundInfoRes.body.user, undefined);

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
      Background.remove().exec(done);
    });
  });
});
