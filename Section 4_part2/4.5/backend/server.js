var express = require('express');
var app = express();
var db = require('./db/db');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var UserController = require('./user/UserController');
app.use('/users', UserController);

var AssociationController = require('./association/association-controller');
app.use('/associations', AssociationController);

var UploadController = require('./file-upload/upload');
app.use('/', UploadController);

module.exports = app;