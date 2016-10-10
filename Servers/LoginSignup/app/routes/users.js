/* eslint-disable new-cap */

// const debug = require('debug')('sap:routes:users');
const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:email', usersController.getUserByEmail);


module.exports = router;
