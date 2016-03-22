'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Professions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/professions',
      permissions: '*'
    }, {
      resources: '/api/professions/:professionId',
      permissions: '*'
    }]
  }, {
    roles: ['consultant'],
    allows: [{
      resources: '/api/professions',
      permissions: ['get', 'post']
    }, {
      resources: '/api/professions/:professionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/professions',
      permissions: ['get']
    }, {
      resources: '/api/professions/:professionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Professions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Profession is being processed and the current user created it then allow any manipulation
  if (req.profession && req.user && req.profession.user && req.profession.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
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
