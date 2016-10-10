/* eslint-disable new-cap */

// const debug = require('debug')('sap:routes:users');
const express = require('express');

const info = require('../controllers/info');
const auth = require('../controllers/auth');

const router = express.Router();

router.get('/:userid', auth.isAuthenticated, info.getInfoForUser);
router.get('/:userid/info/:infoid', auth.isAuthenticated, auth.isOwner, info.getInfoById);

router.post('/:userid', auth.isAuthenticated, auth.isOwner, info.AddNewInfo);

module.exports = router;
