/* eslint-disable new-cap */

const path = require('path');
const fs = require('fs');
const express = require('express');
const debug = require('debug')('sap:routes:users');
const expressJWT = require('express-jwt');

const authController = require('../controllers/auth');

const publicCert = fs.readFileSync(path.resolve('./keys/mykey.pub'));
// expressJWT({ secret: publicCert });

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.get('/private', expressJWT({ secret: publicCert }), (req, res) => {
  debug(res.user);

  return res.status(200).json({ info: 'private route' });
});

module.exports = router;
