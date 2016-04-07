'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Messages Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/messages',
      permissions: '*'
    }, {
      resources: '/api/messages/:messageId',
      permissions: '*'
    }, {
      resources: '/api/messages/context/:contextId',
      permissions: '*'
    }]
  }, {
    roles: ['consultant'],
    allows: [{
      resources: '/api/messages',
      permissions: ['get', 'post', 'put']
    }, {
      resources: '/api/messages/:messageId',
      permissions: ['get', 'post', 'put']
    }, {
      resources: '/api/messages/context/:contextId',
      permissions: ['get', 'post', 'put']
    }]
  }]);
};

function userCanAccess(req, res) {
  if (!req.message) {
    return false;
  }

  var isPoster = req.message.sender && String(req.message.sender) === String(req.user._id);
  var isPublic = req.message.publicity === 'public';
  var isParticipant = req.message.participants && req.message.participants.some(function(participant){
    return String(participant) === String(req.user._id);
  });

  return isPoster || isPublic || isParticipant;
}

/**
 * Check If Messages Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Message is being processed and the current user created it then allow any manipulation
  if (userCanAccess(req, res)) {
    return next();
  }

  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
