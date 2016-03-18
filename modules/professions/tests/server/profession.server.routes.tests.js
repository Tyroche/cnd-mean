'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Profession = mongoose.model('Profession'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, profession;

/**
 * Profession routes tests
 */
describe('Profession CRUD tests', function () {

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

    // Save a user to the test db and create new Profession
    user.save(function () {
      profession = {
        name: 'Profession name'
      };

      done();
    });
  });

  it('should be able to save a Profession if logged in', function (done) {
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

        // Save a new Profession
        agent.post('/api/professions')
          .send(profession)
          .expect(200)
          .end(function (professionSaveErr, professionSaveRes) {
            // Handle Profession save error
            if (professionSaveErr) {
              return done(professionSaveErr);
            }

            // Get a list of Professions
            agent.get('/api/professions')
              .end(function (professionsGetErr, professionsGetRes) {
                // Handle Profession save error
                if (professionsGetErr) {
                  return done(professionsGetErr);
                }

                // Get Professions list
                var professions = professionsGetRes.body;

                // Set assertions
                (professions[0].user._id).should.equal(userId);
                (professions[0].name).should.match('Profession name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Profession if not logged in', function (done) {
    agent.post('/api/professions')
      .send(profession)
      .expect(403)
      .end(function (professionSaveErr, professionSaveRes) {
        // Call the assertion callback
        done(professionSaveErr);
      });
  });

  it('should not be able to save an Profession if no name is provided', function (done) {
    // Invalidate name field
    profession.name = '';

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

        // Save a new Profession
        agent.post('/api/professions')
          .send(profession)
          .expect(400)
          .end(function (professionSaveErr, professionSaveRes) {
            // Set message assertion
            (professionSaveRes.body.message).should.match('Please fill Profession name');

            // Handle Profession save error
            done(professionSaveErr);
          });
      });
  });

  it('should be able to update an Profession if signed in', function (done) {
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

        // Save a new Profession
        agent.post('/api/professions')
          .send(profession)
          .expect(200)
          .end(function (professionSaveErr, professionSaveRes) {
            // Handle Profession save error
            if (professionSaveErr) {
              return done(professionSaveErr);
            }

            // Update Profession name
            profession.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Profession
            agent.put('/api/professions/' + professionSaveRes.body._id)
              .send(profession)
              .expect(200)
              .end(function (professionUpdateErr, professionUpdateRes) {
                // Handle Profession update error
                if (professionUpdateErr) {
                  return done(professionUpdateErr);
                }

                // Set assertions
                (professionUpdateRes.body._id).should.equal(professionSaveRes.body._id);
                (professionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Professions if not signed in', function (done) {
    // Create new Profession model instance
    var professionObj = new Profession(profession);

    // Save the profession
    professionObj.save(function () {
      // Request Professions
      request(app).get('/api/professions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Profession if not signed in', function (done) {
    // Create new Profession model instance
    var professionObj = new Profession(profession);

    // Save the Profession
    professionObj.save(function () {
      request(app).get('/api/professions/' + professionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', profession.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Profession with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/professions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Profession is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Profession which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Profession
    request(app).get('/api/professions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Profession with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Profession if signed in', function (done) {
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

        // Save a new Profession
        agent.post('/api/professions')
          .send(profession)
          .expect(200)
          .end(function (professionSaveErr, professionSaveRes) {
            // Handle Profession save error
            if (professionSaveErr) {
              return done(professionSaveErr);
            }

            // Delete an existing Profession
            agent.delete('/api/professions/' + professionSaveRes.body._id)
              .send(profession)
              .expect(200)
              .end(function (professionDeleteErr, professionDeleteRes) {
                // Handle profession error error
                if (professionDeleteErr) {
                  return done(professionDeleteErr);
                }

                // Set assertions
                (professionDeleteRes.body._id).should.equal(professionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Profession if not signed in', function (done) {
    // Set Profession user
    profession.user = user;

    // Create new Profession model instance
    var professionObj = new Profession(profession);

    // Save the Profession
    professionObj.save(function () {
      // Try deleting Profession
      request(app).delete('/api/professions/' + professionObj._id)
        .expect(403)
        .end(function (professionDeleteErr, professionDeleteRes) {
          // Set message assertion
          (professionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Profession error error
          done(professionDeleteErr);
        });

    });
  });

  it('should be able to get a single Profession that has an orphaned user reference', function (done) {
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

          // Save a new Profession
          agent.post('/api/professions')
            .send(profession)
            .expect(200)
            .end(function (professionSaveErr, professionSaveRes) {
              // Handle Profession save error
              if (professionSaveErr) {
                return done(professionSaveErr);
              }

              // Set assertions on new Profession
              (professionSaveRes.body.name).should.equal(profession.name);
              should.exist(professionSaveRes.body.user);
              should.equal(professionSaveRes.body.user._id, orphanId);

              // force the Profession to have an orphaned user reference
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

                    // Get the Profession
                    agent.get('/api/professions/' + professionSaveRes.body._id)
                      .expect(200)
                      .end(function (professionInfoErr, professionInfoRes) {
                        // Handle Profession error
                        if (professionInfoErr) {
                          return done(professionInfoErr);
                        }

                        // Set assertions
                        (professionInfoRes.body._id).should.equal(professionSaveRes.body._id);
                        (professionInfoRes.body.name).should.equal(profession.name);
                        should.equal(professionInfoRes.body.user, undefined);

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
      Profession.remove().exec(done);
    });
  });
});
