/* eslint-disable new-cap */

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const express = require('express');
const debug = require('debug')('sap:routes:auth');

const cert = fs.readFileSync(path.resolve('./keys/mykey.pem'));
const data = require('../data/users');

const router = express.Router();

router.get('/users', (req, res) =>
  res.status(200).json(data.users));

router.get('/users/:user', (req, res) =>
  res.status(200).json(data.users[req.params.user] || { user: 'not found' }));

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new Error('email or password not defined'));
  }

  const user = data.users[email] || null;
  if (!user) {
    return next(new Error('user not found'));
  }

  if (user.password !== password) {
    return next(new Error('wrong password'));
  }

  const objToSign = {
    email: user.email,
    role: user.role,
  };

  const options = { algorithm: 'RS256' };

  return jwt.sign(objToSign, cert, options, (err, token) => {
    debug(token);
    return res.status(200).json({ token });
  });
});

module.exports = router;
