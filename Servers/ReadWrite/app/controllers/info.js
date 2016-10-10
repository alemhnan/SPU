// const debug = require('debug')('sap:controller:info');
const InfoModel = require('../models/info').InfoModel;

exports.getInfoForUser = (req, res, next) =>
  InfoModel.find({ userId: req.params.userid }).lean().exec()
    .then(info => res.status(200).json(info))
    .catch(next);

exports.getInfoById = (req, res, next) =>
  InfoModel.findById(req.params.infoid).lean().exec()
    .then(info => res.status(200).json(info))
    .catch(next);

exports.AddNewInfo = (req, res, next) =>
  InfoModel.create({ userId: req.params.userid, type: req.body.type, value: req.body.value })
    .then(user => res.status(200).json(user))
    .catch(next);
