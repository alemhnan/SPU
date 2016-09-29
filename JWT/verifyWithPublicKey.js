const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const argv = require('minimist')(process.argv.slice(2));
const token = argv.token;
const publicKey = argv.publicKey;

// verify a token asymmetric
const cert = fs.readFileSync(path.resolve(publicKey));  // get public key
// invalid token - synchronous
try {
  const decoded = jwt.verify(token, cert, options);
  console.log(decoded);
} catch (err) {
  // err
  console.log('TOKEN NOT VERIFIED');
}

