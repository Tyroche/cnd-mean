'use strict';

/**
 * Module dependencies
 */
var wikisPolicy = require('../policies/wikis.server.policy'),
  wikis = require('../controllers/wikis.server.controller');

module.exports = function(app) {
  // Wikis Routes
  app.route('/api/wikis').all(wikisPolicy.isAllowed)
    .get(wikis.list)
    .post(wikis.create);

  app.route('/api/wikis/:wikiId').all(wikisPolicy.isAllowed)
    .get(wikis.read)
    .put(wikis.update)
    .delete(wikis.delete);

  // Finish by binding the Wiki middleware
  app.param('wikiId', wikis.wikiByID);
};
