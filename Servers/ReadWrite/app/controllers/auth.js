/* eslint-disable no-param-reassign */

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const httpErrors = require('httperrors');

const debug = require('debug')('sap:controller:auth');

const SPUWPpKey = fs.readFileSync(path.resolve('./keys/spuwp.pub'));
const pKeys = {
  SPUWP: SPUWPpKey,
};

const fromHeaderOrQuerystring = (req) => {
  debug(req.headers);
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

exports.isAuthenticated = (req, res, next) => {
  const token = fromHeaderOrQuerystring(req);
  const decoded = jwt.decode(token);
  const issuer = decoded.iss;

  if (!issuer) {
    return next(new Error('Issuer not set'));
  }

  const pk = pKeys[issuer];
  if (!pk) {
    return next(new Error('Issuer not known'));
  }

  try {
    const options = {
      algorithm: 'RS256',
      issuer: ['SPU.WP'],
    };
    const decodedAndVerified = jwt.verify(token, pk, options);
    req.user = decodedAndVerified;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.isOwner = (req, res, next) => {
  const isOwner = req.user.userId === req.params.userid;
  return isOwner ? next() : next(new httpErrors.Forbidden());
};

