'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Wiki = mongoose.model('Wiki'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, wiki;

/**
 * Wiki routes tests
 */
describe('Wiki CRUD tests', function () {

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

    // Save a user to the test db and create new Wiki
    user.save(function () {
      wiki = {
        name: 'Wiki name'
      };

      done();
    });
  });

  it('should be able to save a Wiki if logged in', function (done) {
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

        // Save a new Wiki
        agent.post('/api/wikis')
          .send(wiki)
          .expect(200)
          .end(function (wikiSaveErr, wikiSaveRes) {
            // Handle Wiki save error
            if (wikiSaveErr) {
              return done(wikiSaveErr);
            }

            // Get a list of Wikis
            agent.get('/api/wikis')
              .end(function (wikisGetErr, wikisGetRes) {
                // Handle Wiki save error
                if (wikisGetErr) {
                  return done(wikisGetErr);
                }

                // Get Wikis list
                var wikis = wikisGetRes.body;

                // Set assertions
                (wikis[0].user._id).should.equal(userId);
                (wikis[0].name).should.match('Wiki name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Wiki if not logged in', function (done) {
    agent.post('/api/wikis')
      .send(wiki)
      .expect(403)
      .end(function (wikiSaveErr, wikiSaveRes) {
        // Call the assertion callback
        done(wikiSaveErr);
      });
  });

  it('should not be able to save an Wiki if no name is provided', function (done) {
    // Invalidate name field
    wiki.name = '';

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

        // Save a new Wiki
        agent.post('/api/wikis')
          .send(wiki)
          .expect(400)
          .end(function (wikiSaveErr, wikiSaveRes) {
            // Set message assertion
            (wikiSaveRes.body.message).should.match('Please fill Wiki name');

            // Handle Wiki save error
            done(wikiSaveErr);
          });
      });
  });

  it('should be able to update an Wiki if signed in', function (done) {
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

        // Save a new Wiki
        agent.post('/api/wikis')
          .send(wiki)
          .expect(200)
          .end(function (wikiSaveErr, wikiSaveRes) {
            // Handle Wiki save error
            if (wikiSaveErr) {
              return done(wikiSaveErr);
            }

            // Update Wiki name
            wiki.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Wiki
            agent.put('/api/wikis/' + wikiSaveRes.body._id)
              .send(wiki)
              .expect(200)
              .end(function (wikiUpdateErr, wikiUpdateRes) {
                // Handle Wiki update error
                if (wikiUpdateErr) {
                  return done(wikiUpdateErr);
                }

                // Set assertions
                (wikiUpdateRes.body._id).should.equal(wikiSaveRes.body._id);
                (wikiUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Wikis if not signed in', function (done) {
    // Create new Wiki model instance
    var wikiObj = new Wiki(wiki);

    // Save the wiki
    wikiObj.save(function () {
      // Request Wikis
      request(app).get('/api/wikis')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Wiki if not signed in', function (done) {
    // Create new Wiki model instance
    var wikiObj = new Wiki(wiki);

    // Save the Wiki
    wikiObj.save(function () {
      request(app).get('/api/wikis/' + wikiObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', wiki.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Wiki with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/wikis/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Wiki is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Wiki which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Wiki
    request(app).get('/api/wikis/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Wiki with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Wiki if signed in', function (done) {
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

        // Save a new Wiki
        agent.post('/api/wikis')
          .send(wiki)
          .expect(200)
          .end(function (wikiSaveErr, wikiSaveRes) {
            // Handle Wiki save error
            if (wikiSaveErr) {
              return done(wikiSaveErr);
            }

            // Delete an existing Wiki
            agent.delete('/api/wikis/' + wikiSaveRes.body._id)
              .send(wiki)
              .expect(200)
              .end(function (wikiDeleteErr, wikiDeleteRes) {
                // Handle wiki error error
                if (wikiDeleteErr) {
                  return done(wikiDeleteErr);
                }

                // Set assertions
                (wikiDeleteRes.body._id).should.equal(wikiSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Wiki if not signed in', function (done) {
    // Set Wiki user
    wiki.user = user;

    // Create new Wiki model instance
    var wikiObj = new Wiki(wiki);

    // Save the Wiki
    wikiObj.save(function () {
      // Try deleting Wiki
      request(app).delete('/api/wikis/' + wikiObj._id)
        .expect(403)
        .end(function (wikiDeleteErr, wikiDeleteRes) {
          // Set message assertion
          (wikiDeleteRes.body.message).should.match('User is not authorized');

          // Handle Wiki error error
          done(wikiDeleteErr);
        });

    });
  });

  it('should be able to get a single Wiki that has an orphaned user reference', function (done) {
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

          // Save a new Wiki
          agent.post('/api/wikis')
            .send(wiki)
            .expect(200)
            .end(function (wikiSaveErr, wikiSaveRes) {
              // Handle Wiki save error
              if (wikiSaveErr) {
                return done(wikiSaveErr);
              }

              // Set assertions on new Wiki
              (wikiSaveRes.body.name).should.equal(wiki.name);
              should.exist(wikiSaveRes.body.user);
              should.equal(wikiSaveRes.body.user._id, orphanId);

              // force the Wiki to have an orphaned user reference
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

                    // Get the Wiki
                    agent.get('/api/wikis/' + wikiSaveRes.body._id)
                      .expect(200)
                      .end(function (wikiInfoErr, wikiInfoRes) {
                        // Handle Wiki error
                        if (wikiInfoErr) {
                          return done(wikiInfoErr);
                        }

                        // Set assertions
                        (wikiInfoRes.body._id).should.equal(wikiSaveRes.body._id);
                        (wikiInfoRes.body.name).should.equal(wiki.name);
                        should.equal(wikiInfoRes.body.user, undefined);

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
      Wiki.remove().exec(done);
    });
  });
});
