/* eslint-disable new-cap */

const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', authController.login);

router.get('/private', authController.isAuthenticated, (req, res) =>
  res.status(200).json({ info: 'private route' }));

module.exports = router;
