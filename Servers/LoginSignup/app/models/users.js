const debug = require('debug')('sap:models:users');
const mongoose = require('mongoose');
const scrypt = require('scrypt');

// 0.1 -> maxtime
const scryptParameters = scrypt.paramsSync(0.1);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/database';
debug(MONGODB_URI);
mongoose.connect(MONGODB_URI);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: false, default: 'default name' },
  password: { type: String, required: false },
  role: { type: String, required: false },
});

const UserModel = mongoose.model('Users', userSchema);

exports.UserModel = UserModel;

const defaultData = {
  email: 'alessandro.maccagnan@gmail.com',
  name: 'Alessandro',
  password: 'alessandro.maccagnan',
  role: 'admin',
};

scrypt.kdf(defaultData.password, scryptParameters)
  .then((cryptedPassword) => {
    defaultData.password = cryptedPassword.toString('base64');
    return UserModel
      .findOneAndUpdate({ email: defaultData.email }, defaultData, { upsert: true });
  })
  .then(debug)
  .catch(debug);
