'use strict';

/**
 * Module dependencies
 */
var racesPolicy = require('../policies/races.server.policy'),
  races = require('../controllers/races.server.controller');

module.exports = function(app) {
  // Races Routes
  app.route('/api/races').all(racesPolicy.isAllowed)
    .get(races.list)
    .post(races.create);

  app.route('/api/races/:raceId').all(racesPolicy.isAllowed)
    .get(races.read)
    .put(races.update)
    .delete(races.delete);

  // Finish by binding the Race middleware
  app.param('raceId', races.raceByID);
};
