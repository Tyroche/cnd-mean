'use strict';

/**
 * Module dependencies
 */
var featsPolicy = require('../policies/feats.server.policy'),
  feats = require('../controllers/feats.server.controller');

module.exports = function(app) {
  // Feats Routes
  app.route('/api/feats').all(featsPolicy.isAllowed)
    .get(feats.list)
    .post(feats.create);

  app.route('/api/feats/:featId').all(featsPolicy.isAllowed)
    .get(feats.read)
    .put(feats.update)
    .delete(feats.delete);

  // Finish by binding the Feat middleware
  app.param('featId', feats.featByID);
};
