'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Spell = mongoose.model('Spell'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Spell
 */
exports.create = function(req, res) {
  var spell = new Spell(req.body);
  spell.user = req.user;

  spell.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spell);
    }
  });
};

/**
 * Show the current Spell
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var spell = req.spell ? req.spell.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  spell.isCurrentUserOwner = req.user && spell.user && spell.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(spell);
};

/**
 * Update a Spell
 */
exports.update = function(req, res) {
  var spell = req.spell ;

  spell = _.extend(spell , req.body);

  spell.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spell);
    }
  });
};

/**
 * Delete an Spell
 */
exports.delete = function(req, res) {
  var spell = req.spell ;

  spell.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spell);
    }
  });
};

/**
 * List of Spells
 */
exports.list = function(req, res) { 
  Spell.find().sort('-created').populate('user', 'displayName').exec(function(err, spells) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spells);
    }
  });
};

/**
 * Spell middleware
 */
exports.spellByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Spell is invalid'
    });
  }

  Spell.findById(id).populate('user', 'displayName').exec(function (err, spell) {
    if (err) {
      return next(err);
    } else if (!spell) {
      return res.status(404).send({
        message: 'No Spell with that identifier has been found'
      });
    }
    req.spell = spell;
    next();
  });
};
