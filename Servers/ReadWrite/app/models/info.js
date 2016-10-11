const debug = require('debug')('sap:models:info');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/database';
debug(MONGODB_URI);
mongoose.connect(MONGODB_URI);

/* eslint-disable max-len, no-mixed-operators */
const getRandomString = length =>
  Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
/* eslint-enable */

const infoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  random: { type: String, default: () => getRandomString(12) },
  type: { type: String, default: 'NOT_DEFINED' },
  value: { type: String, required: true },
});

const InfoModel = mongoose.model('Info', infoSchema);

exports.InfoModel = InfoModel;
