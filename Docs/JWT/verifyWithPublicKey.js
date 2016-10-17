const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const argv = require('minimist')(process.argv.slice(2));
const token = argv.token;
const publicKeyFile = argv.publicKey;

const publicKey = fs.readFileSync(path.resolve(publicKeyFile));

try {
  const decoded = jwt.verify(token, publicKey, { algorithm: 'RS256' });
  console.log(decoded);
} catch (err) {
  console.log(err);
  console.log('TOKEN NOT VERIFIED');
}

