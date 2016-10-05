/* eslint-disable new-cap */

const express = require('express');
// const debug = require('debug')('sap:routes:users');

const usersController = require('../controllers/users');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:user', usersController.getUser);


module.exports = router;
