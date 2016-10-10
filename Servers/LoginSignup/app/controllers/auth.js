/* eslint-disable new-cap */

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const httpErrors = require('httperrors');
const scrypt = require('scrypt');
const debug = require('debug')('sap:controller:auth');

// 0.1 -> maxtime
const scryptParameters = scrypt.paramsSync(0.1);


const UserModel = require('../models/users').UserModel;

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

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;

  if (!email || !password) {
    return next(new httpErrors.BadRequest('email or password not defined'));
  }
  return UserModel.findOne({ email }).lean().exec()
    .then((_user) => {
      user = _user;
      if (!user) {
        return next(new httpErrors.BadRequest('user not found'));
      }

      return scrypt.verifyKdf(new Buffer(user.password, 'base64'), password);
    })
    .then((isPasswordCorrect) => {
      if (!isPasswordCorrect) {
        throw new httpErrors.Forbidden('wrong password');
      }

      const objToSign = {
        email: user.email,
        role: user.role,
      };

      const options = { algorithm: 'RS256' };

      const token = jwt.sign(objToSign, privateCert, options);
      return res.status(200).json({ token });
    })
    .catch(next);
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new httpErrors.BadRequest('email or password not defined'));
  }

  const query = { email };

  return scrypt.kdf(password, scryptParameters)
    .then((cryptedPassword) => {
      const newUserData = {
        email,
        password: cryptedPassword.toString('base64'),
      };
      return UserModel.findOneAndUpdate(query, newUserData, { new: true, upsert: true })
    })
    .then((user) => {
      debug(user);
      return res.status(200).json({ user });
    })
    .catch(next);
};

// const expressJWT = require('express-jwt');
// var publicKey = fs.readFileSync('/path/to/public.pub');
// expressJWT({ secret: publicCert });

// Should set the user
// We could use express-jwt
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
