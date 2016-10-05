/* eslint-disable new-cap */

// const debug = require('debug')('sap:controller:users');

const data = require('../data/users');

exports.getUsers = (req, res) =>
  res.status(200).json(data.users);

exports.getUser = (req, res) =>
  res.status(200).json(data.users[req.params.user] || { user: 'not found' });
