/* eslint-disable new-cap, no-underscore-dangle */

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
        userId: user._id,
        email: user.email,
        role: user.role,
      };

      debug(objToSign);
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
      return UserModel.findOneAndUpdate(query, newUserData, { new: true, upsert: true });
    })
    .then((user) => {
      debug(user);
      return res.status(200).json({ user });
    })
    .catch(next);
};

exports.allowedDomains = (req, res) => res.status(200).json(['https://containerspu.surge.sh']);
