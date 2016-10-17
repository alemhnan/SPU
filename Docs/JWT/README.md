# Instructions

To create a private key:
`openssl genrsa -out mykey.pem 1024`

To derive the public key:
`openssl rsa -in mykey.pem -pubout > mykey.pub`

Refs:

* <https://www.openssl.org/docs/manmaster/apps/rsa.html>
* <http://stackoverflow.com/a/5246045>

To sign a token using the generated private key:

```bash
node signWithPrivateKey.js --privateKey ./mykey.pem
```

A token signed with the private Key will be signed.

To verify the generated token using the public key:

```bash
node verifyWithPublicKey.js --publicKey ./mykey.pub --token TOKEN
```

It will print the content of the token iff is possible to verify the token given the public key.

