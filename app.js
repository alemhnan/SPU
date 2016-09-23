const express = require('express');
// const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');

const index = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);

app.use(errorHandler);

module.exports = app;
