const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const publicCert = fs.readFileSync(path.resolve('./keys/mykey.pub'));

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()

const fromHeaderOrQuerystring = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const isAuthenticated = (req, res, next) => {
  const token = fromHeaderOrQuerystring(req);
  try {
    const options = { algorithm: 'RS256' };
    const decoded = jwt.verify(token, publicCert, options);
    debug(decoded);
    return next();
  } catch (err) {
    return next(err);
  }
};


app.use(bodyParser.json())
app.use(methodOverride())

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/database';
mongoose.connect(MONGODB_URI);

restify.serve(router, mongoose.model('Users', new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
})))

app.use(isAuthenticated, router);

app.listen(3000, () => {
  console.log('Express server listening on port 3000')
})
