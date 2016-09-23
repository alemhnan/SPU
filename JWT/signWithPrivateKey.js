const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const argv = require('minimist')(process.argv.slice(2));
const privateKey = argv.privateKey;

// sign with RSA SHA256
const cert = fs.readFileSync(path.resolve(privateKey));  // get private key
const token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' });

// sign asynchronously
jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function (err, token) {
  console.log(token);
});