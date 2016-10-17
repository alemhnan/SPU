const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const argv = require('minimist')(process.argv.slice(2));
const privateKeyFile = argv.privateKey;

const privateKey = fs.readFileSync(path.resolve(privateKeyFile));

const token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
console.log(token);
