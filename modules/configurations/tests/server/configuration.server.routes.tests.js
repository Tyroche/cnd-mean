'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Configuration = mongoose.model('Configuration'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, configuration;

/**
 * Configuration routes tests
 */
describe('Configuration CRUD tests', function () {

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

    // Save a user to the test db and create new Configuration
    user.save(function () {
      configuration = {
        name: 'Configuration name'
      };

      done();
    });
  });

  it('should be able to save a Configuration if logged in', function (done) {
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

        // Save a new Configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(200)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Handle Configuration save error
            if (configurationSaveErr) {
              return done(configurationSaveErr);
            }

            // Get a list of Configurations
            agent.get('/api/configurations')
              .end(function (configurationsGetErr, configurationsGetRes) {
                // Handle Configuration save error
                if (configurationsGetErr) {
                  return done(configurationsGetErr);
                }

                // Get Configurations list
                var configurations = configurationsGetRes.body;

                // Set assertions
                (configurations[0].user._id).should.equal(userId);
                (configurations[0].name).should.match('Configuration name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Configuration if not logged in', function (done) {
    agent.post('/api/configurations')
      .send(configuration)
      .expect(403)
      .end(function (configurationSaveErr, configurationSaveRes) {
        // Call the assertion callback
        done(configurationSaveErr);
      });
  });

  it('should not be able to save an Configuration if no name is provided', function (done) {
    // Invalidate name field
    configuration.name = '';

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

        // Save a new Configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(400)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Set message assertion
            (configurationSaveRes.body.message).should.match('Please fill Configuration name');

            // Handle Configuration save error
            done(configurationSaveErr);
          });
      });
  });

  it('should be able to update an Configuration if signed in', function (done) {
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

        // Save a new Configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(200)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Handle Configuration save error
            if (configurationSaveErr) {
              return done(configurationSaveErr);
            }

            // Update Configuration name
            configuration.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Configuration
            agent.put('/api/configurations/' + configurationSaveRes.body._id)
              .send(configuration)
              .expect(200)
              .end(function (configurationUpdateErr, configurationUpdateRes) {
                // Handle Configuration update error
                if (configurationUpdateErr) {
                  return done(configurationUpdateErr);
                }

                // Set assertions
                (configurationUpdateRes.body._id).should.equal(configurationSaveRes.body._id);
                (configurationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Configurations if not signed in', function (done) {
    // Create new Configuration model instance
    var configurationObj = new Configuration(configuration);

    // Save the configuration
    configurationObj.save(function () {
      // Request Configurations
      request(app).get('/api/configurations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Configuration if not signed in', function (done) {
    // Create new Configuration model instance
    var configurationObj = new Configuration(configuration);

    // Save the Configuration
    configurationObj.save(function () {
      request(app).get('/api/configurations/' + configurationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', configuration.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Configuration with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/configurations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Configuration is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Configuration which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Configuration
    request(app).get('/api/configurations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Configuration with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Configuration if signed in', function (done) {
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

        // Save a new Configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(200)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Handle Configuration save error
            if (configurationSaveErr) {
              return done(configurationSaveErr);
            }

            // Delete an existing Configuration
            agent.delete('/api/configurations/' + configurationSaveRes.body._id)
              .send(configuration)
              .expect(200)
              .end(function (configurationDeleteErr, configurationDeleteRes) {
                // Handle configuration error error
                if (configurationDeleteErr) {
                  return done(configurationDeleteErr);
                }

                // Set assertions
                (configurationDeleteRes.body._id).should.equal(configurationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Configuration if not signed in', function (done) {
    // Set Configuration user
    configuration.user = user;

    // Create new Configuration model instance
    var configurationObj = new Configuration(configuration);

    // Save the Configuration
    configurationObj.save(function () {
      // Try deleting Configuration
      request(app).delete('/api/configurations/' + configurationObj._id)
        .expect(403)
        .end(function (configurationDeleteErr, configurationDeleteRes) {
          // Set message assertion
          (configurationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Configuration error error
          done(configurationDeleteErr);
        });

    });
  });

  it('should be able to get a single Configuration that has an orphaned user reference', function (done) {
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

          // Save a new Configuration
          agent.post('/api/configurations')
            .send(configuration)
            .expect(200)
            .end(function (configurationSaveErr, configurationSaveRes) {
              // Handle Configuration save error
              if (configurationSaveErr) {
                return done(configurationSaveErr);
              }

              // Set assertions on new Configuration
              (configurationSaveRes.body.name).should.equal(configuration.name);
              should.exist(configurationSaveRes.body.user);
              should.equal(configurationSaveRes.body.user._id, orphanId);

              // force the Configuration to have an orphaned user reference
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

                    // Get the Configuration
                    agent.get('/api/configurations/' + configurationSaveRes.body._id)
                      .expect(200)
                      .end(function (configurationInfoErr, configurationInfoRes) {
                        // Handle Configuration error
                        if (configurationInfoErr) {
                          return done(configurationInfoErr);
                        }

                        // Set assertions
                        (configurationInfoRes.body._id).should.equal(configurationSaveRes.body._id);
                        (configurationInfoRes.body.name).should.equal(configuration.name);
                        should.equal(configurationInfoRes.body.user, undefined);

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
      Configuration.remove().exec(done);
    });
  });
});
