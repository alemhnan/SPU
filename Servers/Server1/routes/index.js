/* eslint-disable new-cap */

const express = require('express');

const router = express.Router();

const started = new Date();

router.get('/', (req, res) => {
  const uptime = (Date.now() - Number(started)) / 1000;
  const obj = { uptime };
  return res.status(200).json(obj);
});

module.exports = router;
