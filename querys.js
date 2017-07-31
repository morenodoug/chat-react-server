// config file
let config = require('./config');
let pgp = require('pg-promise')();
let db = pgp(config.databaseConnection);


let error = {
    status: null,
    message: null
}


module.exports = db;