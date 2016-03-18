'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Race = mongoose.model('Race'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, race;

/**
 * Race routes tests
 */
describe('Race CRUD tests', function () {

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

    // Save a user to the test db and create new Race
    user.save(function () {
      race = {
        name: 'Race name'
      };

      done();
    });
  });

  it('should be able to save a Race if logged in', function (done) {
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

        // Save a new Race
        agent.post('/api/races')
          .send(race)
          .expect(200)
          .end(function (raceSaveErr, raceSaveRes) {
            // Handle Race save error
            if (raceSaveErr) {
              return done(raceSaveErr);
            }

            // Get a list of Races
            agent.get('/api/races')
              .end(function (racesGetErr, racesGetRes) {
                // Handle Race save error
                if (racesGetErr) {
                  return done(racesGetErr);
                }

                // Get Races list
                var races = racesGetRes.body;

                // Set assertions
                (races[0].user._id).should.equal(userId);
                (races[0].name).should.match('Race name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Race if not logged in', function (done) {
    agent.post('/api/races')
      .send(race)
      .expect(403)
      .end(function (raceSaveErr, raceSaveRes) {
        // Call the assertion callback
        done(raceSaveErr);
      });
  });

  it('should not be able to save an Race if no name is provided', function (done) {
    // Invalidate name field
    race.name = '';

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

        // Save a new Race
        agent.post('/api/races')
          .send(race)
          .expect(400)
          .end(function (raceSaveErr, raceSaveRes) {
            // Set message assertion
            (raceSaveRes.body.message).should.match('Please fill Race name');

            // Handle Race save error
            done(raceSaveErr);
          });
      });
  });

  it('should be able to update an Race if signed in', function (done) {
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

        // Save a new Race
        agent.post('/api/races')
          .send(race)
          .expect(200)
          .end(function (raceSaveErr, raceSaveRes) {
            // Handle Race save error
            if (raceSaveErr) {
              return done(raceSaveErr);
            }

            // Update Race name
            race.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Race
            agent.put('/api/races/' + raceSaveRes.body._id)
              .send(race)
              .expect(200)
              .end(function (raceUpdateErr, raceUpdateRes) {
                // Handle Race update error
                if (raceUpdateErr) {
                  return done(raceUpdateErr);
                }

                // Set assertions
                (raceUpdateRes.body._id).should.equal(raceSaveRes.body._id);
                (raceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Races if not signed in', function (done) {
    // Create new Race model instance
    var raceObj = new Race(race);

    // Save the race
    raceObj.save(function () {
      // Request Races
      request(app).get('/api/races')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Race if not signed in', function (done) {
    // Create new Race model instance
    var raceObj = new Race(race);

    // Save the Race
    raceObj.save(function () {
      request(app).get('/api/races/' + raceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', race.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Race with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/races/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Race is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Race which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Race
    request(app).get('/api/races/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Race with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Race if signed in', function (done) {
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

        // Save a new Race
        agent.post('/api/races')
          .send(race)
          .expect(200)
          .end(function (raceSaveErr, raceSaveRes) {
            // Handle Race save error
            if (raceSaveErr) {
              return done(raceSaveErr);
            }

            // Delete an existing Race
            agent.delete('/api/races/' + raceSaveRes.body._id)
              .send(race)
              .expect(200)
              .end(function (raceDeleteErr, raceDeleteRes) {
                // Handle race error error
                if (raceDeleteErr) {
                  return done(raceDeleteErr);
                }

                // Set assertions
                (raceDeleteRes.body._id).should.equal(raceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Race if not signed in', function (done) {
    // Set Race user
    race.user = user;

    // Create new Race model instance
    var raceObj = new Race(race);

    // Save the Race
    raceObj.save(function () {
      // Try deleting Race
      request(app).delete('/api/races/' + raceObj._id)
        .expect(403)
        .end(function (raceDeleteErr, raceDeleteRes) {
          // Set message assertion
          (raceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Race error error
          done(raceDeleteErr);
        });

    });
  });

  it('should be able to get a single Race that has an orphaned user reference', function (done) {
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

          // Save a new Race
          agent.post('/api/races')
            .send(race)
            .expect(200)
            .end(function (raceSaveErr, raceSaveRes) {
              // Handle Race save error
              if (raceSaveErr) {
                return done(raceSaveErr);
              }

              // Set assertions on new Race
              (raceSaveRes.body.name).should.equal(race.name);
              should.exist(raceSaveRes.body.user);
              should.equal(raceSaveRes.body.user._id, orphanId);

              // force the Race to have an orphaned user reference
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

                    // Get the Race
                    agent.get('/api/races/' + raceSaveRes.body._id)
                      .expect(200)
                      .end(function (raceInfoErr, raceInfoRes) {
                        // Handle Race error
                        if (raceInfoErr) {
                          return done(raceInfoErr);
                        }

                        // Set assertions
                        (raceInfoRes.body._id).should.equal(raceSaveRes.body._id);
                        (raceInfoRes.body.name).should.equal(race.name);
                        should.equal(raceInfoRes.body.user, undefined);

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
      Race.remove().exec(done);
    });
  });
});
