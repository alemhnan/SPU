/* eslint no-confusing-arrow: ["error", {allowParens: true}],  */
/* eslint-disable no-param-reassign */

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const httpErrors = require('httperrors');

const debug = require('debug')('sap:controller:auth');

const publicKey = fs.readFileSync(path.resolve('./keys/mykey.pub'));

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
  try {
    const options = { algorithm: 'RS256' };
    const decoded = jwt.verify(token, publicKey, options);
    req.user = decoded;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.isOwner = (req, res, next) => {
  const isOwner = req.user.userId === req.params.userid;
  return isOwner ? next() : next(new httpErrors.Forbidden());
};

