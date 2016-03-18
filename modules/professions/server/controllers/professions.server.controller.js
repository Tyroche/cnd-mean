'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Profession = mongoose.model('Profession'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Profession
 */
exports.create = function(req, res) {
  var profession = new Profession(req.body);
  profession.user = req.user;

  profession.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profession);
    }
  });
};

/**
 * Show the current Profession
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var profession = req.profession ? req.profession.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  profession.isCurrentUserOwner = req.user && profession.user && profession.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(profession);
};

/**
 * Update a Profession
 */
exports.update = function(req, res) {
  var profession = req.profession ;

  profession = _.extend(profession , req.body);

  profession.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profession);
    }
  });
};

/**
 * Delete an Profession
 */
exports.delete = function(req, res) {
  var profession = req.profession ;

  profession.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profession);
    }
  });
};

/**
 * List of Professions
 */
exports.list = function(req, res) { 
  Profession.find().sort('-created').populate('user', 'displayName').exec(function(err, professions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(professions);
    }
  });
};

/**
 * Profession middleware
 */
exports.professionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Profession is invalid'
    });
  }

  Profession.findById(id).populate('user', 'displayName').exec(function (err, profession) {
    if (err) {
      return next(err);
    } else if (!profession) {
      return res.status(404).send({
        message: 'No Profession with that identifier has been found'
      });
    }
    req.profession = profession;
    next();
  });
};
