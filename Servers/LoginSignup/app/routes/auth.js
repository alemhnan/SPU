/* eslint-disable new-cap */

const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/allowedDomains', authController.signup);

module.exports = router;
