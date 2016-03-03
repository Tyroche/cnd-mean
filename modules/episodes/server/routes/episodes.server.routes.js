'use strict';

/**
 * Module dependencies
 */
var episodesPolicy = require('../policies/episodes.server.policy'),
  episodes = require('../controllers/episodes.server.controller');

module.exports = function(app) {
  // Episodes Routes
  app.route('/api/episodes').all(episodesPolicy.isAllowed)
    .get(episodes.list)
    .post(episodes.create);

  app.route('/api/episodes/:episodeId').all(episodesPolicy.isAllowed)
    .get(episodes.read)
    .put(episodes.update)
    .delete(episodes.delete);

  // Finish by binding the Episode middleware
  app.param('episodeId', episodes.episodeByID);
};
