// const debug = require('debug')('sap:controller:users');
const UserModel = require('../models/users').UserModel;

exports.getUsers = (req, res) =>
  UserModel.find().lean().exec()
    .then(users => res.status(200).json(users));

exports.getUserByEmail = (req, res) => UserModel.findOne({ email: req.params.email }).lean().exec()
    .then(user => res.status(200).json(user));

