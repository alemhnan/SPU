/* eslint-disable new-cap */

const path = require('path');
const fs = require('fs');
const express = require('express');
const debug = require('debug')('sap:routes:users');
const expressJWT = require('express-jwt');

const authController = require('../controllers/auth');

const publicCert = fs.readFileSync(path.resolve('./keys/mykey.pub'));

const fromHeaderOrQuerystring = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.get('/private', expressJWT({ secret: publicCert, getToken: fromHeaderOrQuerystring }), (req, res) => {
  debug(res.user);

  return res.status(200).json({ info: 'private route' });
});

module.exports = router;
