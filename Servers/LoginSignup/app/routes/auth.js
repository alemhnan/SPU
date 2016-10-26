/* eslint-disable new-cap */

const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/allowedDomains', authController.allowedDomains);

module.exports = router;
