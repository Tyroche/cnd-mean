'use strict';

/**
 * Module dependencies
 */
var professionsPolicy = require('../policies/professions.server.policy'),
  professions = require('../controllers/professions.server.controller');

module.exports = function(app) {
  // Professions Routes
  app.route('/api/professions').all(professionsPolicy.isAllowed)
    .get(professions.list)
    .post(professions.create);

  app.route('/api/professions/:professionId').all(professionsPolicy.isAllowed)
    .get(professions.read)
    .put(professions.update)
    .delete(professions.delete);

  // Finish by binding the Profession middleware
  app.param('professionId', professions.professionByID);
};
