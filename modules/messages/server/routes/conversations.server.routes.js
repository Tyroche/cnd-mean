'use strict';

/**
 * Module dependencies
 */
var conversationsPolicy = require('../policies/conversations.server.policy'),
  conversations = require('../controllers/conversations.server.controller');

module.exports = function(app) {
  // Conversations Routes
  app.route('/api/conversations').all(conversationsPolicy.isAllowed)
    .get(conversations.list)
    .post(conversations.create);

  app.route('/api/conversations/:conversationId').all(conversationsPolicy.isAllowed)
    .get(conversations.read)
    .put(conversations.update)
    .delete(conversations.delete);

  // Finish by binding the Conversation middleware
  app.param('conversationId', conversations.conversationByID);
};
