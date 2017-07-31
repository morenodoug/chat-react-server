// config file
let config = require('./config');
let pgp = require('pg-promise')();
let db = pgp(config.databaseConnection);


module.exports = db;