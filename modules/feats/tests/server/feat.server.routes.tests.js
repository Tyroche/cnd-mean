'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Feat = mongoose.model('Feat'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, feat;

/**
 * Feat routes tests
 */
describe('Feat CRUD tests', function () {

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

    // Save a user to the test db and create new Feat
    user.save(function () {
      feat = {
        name: 'Feat name'
      };

      done();
    });
  });

  it('should be able to save a Feat if logged in', function (done) {
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

        // Save a new Feat
        agent.post('/api/feats')
          .send(feat)
          .expect(200)
          .end(function (featSaveErr, featSaveRes) {
            // Handle Feat save error
            if (featSaveErr) {
              return done(featSaveErr);
            }

            // Get a list of Feats
            agent.get('/api/feats')
              .end(function (featsGetErr, featsGetRes) {
                // Handle Feat save error
                if (featsGetErr) {
                  return done(featsGetErr);
                }

                // Get Feats list
                var feats = featsGetRes.body;

                // Set assertions
                (feats[0].user._id).should.equal(userId);
                (feats[0].name).should.match('Feat name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Feat if not logged in', function (done) {
    agent.post('/api/feats')
      .send(feat)
      .expect(403)
      .end(function (featSaveErr, featSaveRes) {
        // Call the assertion callback
        done(featSaveErr);
      });
  });

  it('should not be able to save an Feat if no name is provided', function (done) {
    // Invalidate name field
    feat.name = '';

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

        // Save a new Feat
        agent.post('/api/feats')
          .send(feat)
          .expect(400)
          .end(function (featSaveErr, featSaveRes) {
            // Set message assertion
            (featSaveRes.body.message).should.match('Please fill Feat name');

            // Handle Feat save error
            done(featSaveErr);
          });
      });
  });

  it('should be able to update an Feat if signed in', function (done) {
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

        // Save a new Feat
        agent.post('/api/feats')
          .send(feat)
          .expect(200)
          .end(function (featSaveErr, featSaveRes) {
            // Handle Feat save error
            if (featSaveErr) {
              return done(featSaveErr);
            }

            // Update Feat name
            feat.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Feat
            agent.put('/api/feats/' + featSaveRes.body._id)
              .send(feat)
              .expect(200)
              .end(function (featUpdateErr, featUpdateRes) {
                // Handle Feat update error
                if (featUpdateErr) {
                  return done(featUpdateErr);
                }

                // Set assertions
                (featUpdateRes.body._id).should.equal(featSaveRes.body._id);
                (featUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Feats if not signed in', function (done) {
    // Create new Feat model instance
    var featObj = new Feat(feat);

    // Save the feat
    featObj.save(function () {
      // Request Feats
      request(app).get('/api/feats')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Feat if not signed in', function (done) {
    // Create new Feat model instance
    var featObj = new Feat(feat);

    // Save the Feat
    featObj.save(function () {
      request(app).get('/api/feats/' + featObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', feat.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Feat with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/feats/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Feat is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Feat which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Feat
    request(app).get('/api/feats/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Feat with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Feat if signed in', function (done) {
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

        // Save a new Feat
        agent.post('/api/feats')
          .send(feat)
          .expect(200)
          .end(function (featSaveErr, featSaveRes) {
            // Handle Feat save error
            if (featSaveErr) {
              return done(featSaveErr);
            }

            // Delete an existing Feat
            agent.delete('/api/feats/' + featSaveRes.body._id)
              .send(feat)
              .expect(200)
              .end(function (featDeleteErr, featDeleteRes) {
                // Handle feat error error
                if (featDeleteErr) {
                  return done(featDeleteErr);
                }

                // Set assertions
                (featDeleteRes.body._id).should.equal(featSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Feat if not signed in', function (done) {
    // Set Feat user
    feat.user = user;

    // Create new Feat model instance
    var featObj = new Feat(feat);

    // Save the Feat
    featObj.save(function () {
      // Try deleting Feat
      request(app).delete('/api/feats/' + featObj._id)
        .expect(403)
        .end(function (featDeleteErr, featDeleteRes) {
          // Set message assertion
          (featDeleteRes.body.message).should.match('User is not authorized');

          // Handle Feat error error
          done(featDeleteErr);
        });

    });
  });

  it('should be able to get a single Feat that has an orphaned user reference', function (done) {
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

          // Save a new Feat
          agent.post('/api/feats')
            .send(feat)
            .expect(200)
            .end(function (featSaveErr, featSaveRes) {
              // Handle Feat save error
              if (featSaveErr) {
                return done(featSaveErr);
              }

              // Set assertions on new Feat
              (featSaveRes.body.name).should.equal(feat.name);
              should.exist(featSaveRes.body.user);
              should.equal(featSaveRes.body.user._id, orphanId);

              // force the Feat to have an orphaned user reference
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

                    // Get the Feat
                    agent.get('/api/feats/' + featSaveRes.body._id)
                      .expect(200)
                      .end(function (featInfoErr, featInfoRes) {
                        // Handle Feat error
                        if (featInfoErr) {
                          return done(featInfoErr);
                        }

                        // Set assertions
                        (featInfoRes.body._id).should.equal(featSaveRes.body._id);
                        (featInfoRes.body.name).should.equal(feat.name);
                        should.equal(featInfoRes.body.user, undefined);

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
      Feat.remove().exec(done);
    });
  });
});
