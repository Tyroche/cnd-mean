'use strict';

/**
 * Module dependencies
 */
var backgroundsPolicy = require('../policies/backgrounds.server.policy'),
  backgrounds = require('../controllers/backgrounds.server.controller');

module.exports = function(app) {
  // Backgrounds Routes
  app.route('/api/backgrounds').all(backgroundsPolicy.isAllowed)
    .get(backgrounds.list)
    .post(backgrounds.create);

  app.route('/api/backgrounds/:backgroundId').all(backgroundsPolicy.isAllowed)
    .get(backgrounds.read)
    .put(backgrounds.update)
    .delete(backgrounds.delete);

  // Finish by binding the Background middleware
  app.param('backgroundId', backgrounds.backgroundByID);
};
