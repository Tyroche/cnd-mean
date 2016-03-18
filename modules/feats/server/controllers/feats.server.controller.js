'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Feat = mongoose.model('Feat'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Feat
 */
exports.create = function(req, res) {
  var feat = new Feat(req.body);
  feat.user = req.user;

  feat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feat);
    }
  });
};

/**
 * Show the current Feat
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var feat = req.feat ? req.feat.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  feat.isCurrentUserOwner = req.user && feat.user && feat.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(feat);
};

/**
 * Update a Feat
 */
exports.update = function(req, res) {
  var feat = req.feat ;

  feat = _.extend(feat , req.body);

  feat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feat);
    }
  });
};

/**
 * Delete an Feat
 */
exports.delete = function(req, res) {
  var feat = req.feat ;

  feat.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feat);
    }
  });
};

/**
 * List of Feats
 */
exports.list = function(req, res) { 
  Feat.find().sort('-created').populate('user', 'displayName').exec(function(err, feats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feats);
    }
  });
};

/**
 * Feat middleware
 */
exports.featByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Feat is invalid'
    });
  }

  Feat.findById(id).populate('user', 'displayName').exec(function (err, feat) {
    if (err) {
      return next(err);
    } else if (!feat) {
      return res.status(404).send({
        message: 'No Feat with that identifier has been found'
      });
    }
    req.feat = feat;
    next();
  });
};
