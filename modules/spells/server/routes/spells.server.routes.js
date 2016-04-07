'use strict';

/**
 * Module dependencies
 */
var spellsPolicy = require('../policies/spells.server.policy'),
  spells = require('../controllers/spells.server.controller');

module.exports = function(app) {
  // Spells Routes
  app.route('/api/spells').all(spellsPolicy.isAllowed)
    .get(spells.list)
    .post(spells.create);

  app.route('/api/spells/:spellId').all(spellsPolicy.isAllowed)
    .get(spells.read)
    .put(spells.update)
    .delete(spells.delete);

  // Finish by binding the Spell middleware
  app.param('spellId', spells.spellByID);
};
