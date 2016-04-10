'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Conversation = mongoose.model('Conversation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, conversation;

/**
 * Conversation routes tests
 */
describe('Conversation CRUD tests', function () {

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

    // Save a user to the test db and create new Conversation
    user.save(function () {
      conversation = {
        name: 'Conversation name'
      };

      done();
    });
  });

  it('should be able to save a Conversation if logged in', function (done) {
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

        // Save a new Conversation
        agent.post('/api/conversations')
          .send(conversation)
          .expect(200)
          .end(function (conversationSaveErr, conversationSaveRes) {
            // Handle Conversation save error
            if (conversationSaveErr) {
              return done(conversationSaveErr);
            }

            // Get a list of Conversations
            agent.get('/api/conversations')
              .end(function (conversationsGetErr, conversationsGetRes) {
                // Handle Conversation save error
                if (conversationsGetErr) {
                  return done(conversationsGetErr);
                }

                // Get Conversations list
                var conversations = conversationsGetRes.body;

                // Set assertions
                (conversations[0].user._id).should.equal(userId);
                (conversations[0].name).should.match('Conversation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Conversation if not logged in', function (done) {
    agent.post('/api/conversations')
      .send(conversation)
      .expect(403)
      .end(function (conversationSaveErr, conversationSaveRes) {
        // Call the assertion callback
        done(conversationSaveErr);
      });
  });

  it('should not be able to save an Conversation if no name is provided', function (done) {
    // Invalidate name field
    conversation.name = '';

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

        // Save a new Conversation
        agent.post('/api/conversations')
          .send(conversation)
          .expect(400)
          .end(function (conversationSaveErr, conversationSaveRes) {
            // Set message assertion
            (conversationSaveRes.body.message).should.match('Please fill Conversation name');

            // Handle Conversation save error
            done(conversationSaveErr);
          });
      });
  });

  it('should be able to update an Conversation if signed in', function (done) {
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

        // Save a new Conversation
        agent.post('/api/conversations')
          .send(conversation)
          .expect(200)
          .end(function (conversationSaveErr, conversationSaveRes) {
            // Handle Conversation save error
            if (conversationSaveErr) {
              return done(conversationSaveErr);
            }

            // Update Conversation name
            conversation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Conversation
            agent.put('/api/conversations/' + conversationSaveRes.body._id)
              .send(conversation)
              .expect(200)
              .end(function (conversationUpdateErr, conversationUpdateRes) {
                // Handle Conversation update error
                if (conversationUpdateErr) {
                  return done(conversationUpdateErr);
                }

                // Set assertions
                (conversationUpdateRes.body._id).should.equal(conversationSaveRes.body._id);
                (conversationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Conversations if not signed in', function (done) {
    // Create new Conversation model instance
    var conversationObj = new Conversation(conversation);

    // Save the conversation
    conversationObj.save(function () {
      // Request Conversations
      request(app).get('/api/conversations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Conversation if not signed in', function (done) {
    // Create new Conversation model instance
    var conversationObj = new Conversation(conversation);

    // Save the Conversation
    conversationObj.save(function () {
      request(app).get('/api/conversations/' + conversationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', conversation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Conversation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/conversations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Conversation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Conversation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Conversation
    request(app).get('/api/conversations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Conversation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Conversation if signed in', function (done) {
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

        // Save a new Conversation
        agent.post('/api/conversations')
          .send(conversation)
          .expect(200)
          .end(function (conversationSaveErr, conversationSaveRes) {
            // Handle Conversation save error
            if (conversationSaveErr) {
              return done(conversationSaveErr);
            }

            // Delete an existing Conversation
            agent.delete('/api/conversations/' + conversationSaveRes.body._id)
              .send(conversation)
              .expect(200)
              .end(function (conversationDeleteErr, conversationDeleteRes) {
                // Handle conversation error error
                if (conversationDeleteErr) {
                  return done(conversationDeleteErr);
                }

                // Set assertions
                (conversationDeleteRes.body._id).should.equal(conversationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Conversation if not signed in', function (done) {
    // Set Conversation user
    conversation.user = user;

    // Create new Conversation model instance
    var conversationObj = new Conversation(conversation);

    // Save the Conversation
    conversationObj.save(function () {
      // Try deleting Conversation
      request(app).delete('/api/conversations/' + conversationObj._id)
        .expect(403)
        .end(function (conversationDeleteErr, conversationDeleteRes) {
          // Set message assertion
          (conversationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Conversation error error
          done(conversationDeleteErr);
        });

    });
  });

  it('should be able to get a single Conversation that has an orphaned user reference', function (done) {
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

          // Save a new Conversation
          agent.post('/api/conversations')
            .send(conversation)
            .expect(200)
            .end(function (conversationSaveErr, conversationSaveRes) {
              // Handle Conversation save error
              if (conversationSaveErr) {
                return done(conversationSaveErr);
              }

              // Set assertions on new Conversation
              (conversationSaveRes.body.name).should.equal(conversation.name);
              should.exist(conversationSaveRes.body.user);
              should.equal(conversationSaveRes.body.user._id, orphanId);

              // force the Conversation to have an orphaned user reference
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

                    // Get the Conversation
                    agent.get('/api/conversations/' + conversationSaveRes.body._id)
                      .expect(200)
                      .end(function (conversationInfoErr, conversationInfoRes) {
                        // Handle Conversation error
                        if (conversationInfoErr) {
                          return done(conversationInfoErr);
                        }

                        // Set assertions
                        (conversationInfoRes.body._id).should.equal(conversationSaveRes.body._id);
                        (conversationInfoRes.body.name).should.equal(conversation.name);
                        should.equal(conversationInfoRes.body.user, undefined);

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
      Conversation.remove().exec(done);
    });
  });
});
