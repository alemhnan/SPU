const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const argv = require('minimist')(process.argv.slice(2));
const token = argv.token;
const publicKey = argv.publicKey;

// verify a token asymmetric
const cert = fs.readFileSync(path.resolve(publicKey));  // get public key
jwt.verify(token, cert, function (err, decoded) {
  if (err) {
    console.log('TOKEN NOT VERIFIED');
    return;
  }

  console.log(decoded);
});
