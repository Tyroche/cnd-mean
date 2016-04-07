'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spell = mongoose.model('Spell'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, spell;

/**
 * Spell routes tests
 */
describe('Spell CRUD tests', function () {

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

    // Save a user to the test db and create new Spell
    user.save(function () {
      spell = {
        name: 'Spell name'
      };

      done();
    });
  });

  it('should be able to save a Spell if logged in', function (done) {
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

        // Save a new Spell
        agent.post('/api/spells')
          .send(spell)
          .expect(200)
          .end(function (spellSaveErr, spellSaveRes) {
            // Handle Spell save error
            if (spellSaveErr) {
              return done(spellSaveErr);
            }

            // Get a list of Spells
            agent.get('/api/spells')
              .end(function (spellsGetErr, spellsGetRes) {
                // Handle Spell save error
                if (spellsGetErr) {
                  return done(spellsGetErr);
                }

                // Get Spells list
                var spells = spellsGetRes.body;

                // Set assertions
                (spells[0].user._id).should.equal(userId);
                (spells[0].name).should.match('Spell name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Spell if not logged in', function (done) {
    agent.post('/api/spells')
      .send(spell)
      .expect(403)
      .end(function (spellSaveErr, spellSaveRes) {
        // Call the assertion callback
        done(spellSaveErr);
      });
  });

  it('should not be able to save an Spell if no name is provided', function (done) {
    // Invalidate name field
    spell.name = '';

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

        // Save a new Spell
        agent.post('/api/spells')
          .send(spell)
          .expect(400)
          .end(function (spellSaveErr, spellSaveRes) {
            // Set message assertion
            (spellSaveRes.body.message).should.match('Please fill Spell name');

            // Handle Spell save error
            done(spellSaveErr);
          });
      });
  });

  it('should be able to update an Spell if signed in', function (done) {
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

        // Save a new Spell
        agent.post('/api/spells')
          .send(spell)
          .expect(200)
          .end(function (spellSaveErr, spellSaveRes) {
            // Handle Spell save error
            if (spellSaveErr) {
              return done(spellSaveErr);
            }

            // Update Spell name
            spell.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Spell
            agent.put('/api/spells/' + spellSaveRes.body._id)
              .send(spell)
              .expect(200)
              .end(function (spellUpdateErr, spellUpdateRes) {
                // Handle Spell update error
                if (spellUpdateErr) {
                  return done(spellUpdateErr);
                }

                // Set assertions
                (spellUpdateRes.body._id).should.equal(spellSaveRes.body._id);
                (spellUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Spells if not signed in', function (done) {
    // Create new Spell model instance
    var spellObj = new Spell(spell);

    // Save the spell
    spellObj.save(function () {
      // Request Spells
      request(app).get('/api/spells')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Spell if not signed in', function (done) {
    // Create new Spell model instance
    var spellObj = new Spell(spell);

    // Save the Spell
    spellObj.save(function () {
      request(app).get('/api/spells/' + spellObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', spell.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Spell with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/spells/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Spell is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Spell which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Spell
    request(app).get('/api/spells/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Spell with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Spell if signed in', function (done) {
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

        // Save a new Spell
        agent.post('/api/spells')
          .send(spell)
          .expect(200)
          .end(function (spellSaveErr, spellSaveRes) {
            // Handle Spell save error
            if (spellSaveErr) {
              return done(spellSaveErr);
            }

            // Delete an existing Spell
            agent.delete('/api/spells/' + spellSaveRes.body._id)
              .send(spell)
              .expect(200)
              .end(function (spellDeleteErr, spellDeleteRes) {
                // Handle spell error error
                if (spellDeleteErr) {
                  return done(spellDeleteErr);
                }

                // Set assertions
                (spellDeleteRes.body._id).should.equal(spellSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Spell if not signed in', function (done) {
    // Set Spell user
    spell.user = user;

    // Create new Spell model instance
    var spellObj = new Spell(spell);

    // Save the Spell
    spellObj.save(function () {
      // Try deleting Spell
      request(app).delete('/api/spells/' + spellObj._id)
        .expect(403)
        .end(function (spellDeleteErr, spellDeleteRes) {
          // Set message assertion
          (spellDeleteRes.body.message).should.match('User is not authorized');

          // Handle Spell error error
          done(spellDeleteErr);
        });

    });
  });

  it('should be able to get a single Spell that has an orphaned user reference', function (done) {
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

          // Save a new Spell
          agent.post('/api/spells')
            .send(spell)
            .expect(200)
            .end(function (spellSaveErr, spellSaveRes) {
              // Handle Spell save error
              if (spellSaveErr) {
                return done(spellSaveErr);
              }

              // Set assertions on new Spell
              (spellSaveRes.body.name).should.equal(spell.name);
              should.exist(spellSaveRes.body.user);
              should.equal(spellSaveRes.body.user._id, orphanId);

              // force the Spell to have an orphaned user reference
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

                    // Get the Spell
                    agent.get('/api/spells/' + spellSaveRes.body._id)
                      .expect(200)
                      .end(function (spellInfoErr, spellInfoRes) {
                        // Handle Spell error
                        if (spellInfoErr) {
                          return done(spellInfoErr);
                        }

                        // Set assertions
                        (spellInfoRes.body._id).should.equal(spellSaveRes.body._id);
                        (spellInfoRes.body.name).should.equal(spell.name);
                        should.equal(spellInfoRes.body.user, undefined);

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
      Spell.remove().exec(done);
    });
  });
});
