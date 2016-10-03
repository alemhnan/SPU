/* eslint-disable new-cap */

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const httpErrors = require('httperrors');
const debug = require('debug')('sap:controller:auth');

const privateCert = fs.readFileSync(path.resolve('./keys/mykey.pem'));
const publicCert = fs.readFileSync(path.resolve('./keys/mykey.pub'));

const fromHeaderOrQuerystring = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const data = require('../data/users');

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new httpErrors.BadRequest('email or password not defined'));
  }

  const user = data.users[email] || null;
  if (!user) {
    return next(new httpErrors.BadRequest('user not found'));
  }

  if (user.password !== password) {
    return next(new httpErrors.BadRequest('wrong password'));
  }

  const objToSign = {
    email: user.email,
    role: user.role,
  };

  const options = { algorithm: 'RS256' };

  const token = jwt.sign(objToSign, privateCert, options);
  return res.status(200).json({ token });
};

exports.isAuthenticated = (req, res, next) => {
  const token = fromHeaderOrQuerystring(req);
  try {
    const options = { algorithm: 'RS256' };
    const decoded = jwt.verify(token, publicCert, options);
    debug(decoded);
    return next();
  } catch (err) {
    return next(err);
  }
};
