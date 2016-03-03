'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Wiki = mongoose.model('Wiki'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Wiki
 */
exports.create = function(req, res) {
  var wiki = new Wiki(req.body);
  wiki.user = req.user;

  wiki.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(wiki);
    }
  });
};

/**
 * Show the current Wiki
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var wiki = req.wiki ? req.wiki.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  wiki.isCurrentUserOwner = req.user && wiki.user && wiki.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(wiki);
};

/**
 * Update a Wiki
 */
exports.update = function(req, res) {
  var wiki = req.wiki ;

  wiki = _.extend(wiki , req.body);

  wiki.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(wiki);
    }
  });
};

/**
 * Delete an Wiki
 */
exports.delete = function(req, res) {
  var wiki = req.wiki ;

  wiki.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(wiki);
    }
  });
};

/**
 * List of Wikis
 */
exports.list = function(req, res) { 
  Wiki.find().sort('-created').populate('user', 'displayName').exec(function(err, wikis) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(wikis);
    }
  });
};

/**
 * Wiki middleware
 */
exports.wikiByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Wiki is invalid'
    });
  }

  Wiki.findById(id).populate('user', 'displayName').exec(function (err, wiki) {
    if (err) {
      return next(err);
    } else if (!wiki) {
      return res.status(404).send({
        message: 'No Wiki with that identifier has been found'
      });
    }
    req.wiki = wiki;
    next();
  });
};
