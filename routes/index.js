var express = require('express');
var router = express.Router();
var _ = require('lodash')

// jwt
var jwt = require('jsonwebtoken');

//aux functions 
let auxFunctions = require('../aux-modules/aux-functions');

//querys 
let db = require('../querys');


router.post('/signup', (req, res, next) => {
    if (_.isUndefined(req.body.email)) {
        return res.status(400).json({
            error: 'proporcione email'
        });
    }
    if (_.isUndefined(req.body.password)) {
        return res.status(400).json({
            error: 'proporcione password'
        });
    }

    auxFunctions.validateEmail(req.body.email).
    then(auxFunctions.usedEmail).
    then((result) => {
        return res.status(200).json(result);
    }).
    catch((err) => {
        return res.status(err.status).json({ error: err.message })
    });


});

module.exports = router;