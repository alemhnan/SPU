/* eslint-disable new-cap */

const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const express = require('express');
const debug = require('debug')('sap:routes:auth');
const data = require('../data/users');

const router = express.Router();

router.get('/users', (req, res) => res.status(200).json(data.users));
router.get('/users/:user', (req, res) => res.status(200).json(data.users[req.params.user]));

router.post('/login', (req, res) => {
    // get private key
  const cert = fs.readFileSync(path.resolve('./keys/mykey.pem'));

  const objToSign = { foo: 'bar' };
  const options = { algorithm: 'RS256' };

  jwt.sign(objToSign, cert, options, (err, token) => {
    debug(token);
    const obj = { token };
    return res.status(200).json(obj);
  });
});


module.exports = router;
