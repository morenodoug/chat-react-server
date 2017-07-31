var express = require('express');
var router = express.Router();
var _ = require('lodash')

// jwt
let jwt = require('jsonwebtoken');

//aux functions 
let auxFunctions = require('../aux-modules/aux-functions');
let config = require('../config');

//querys 
let db = require('../querys');

let bcrypt = require('bcrypt');

let jsonwebtoken = require('jsonwebtoken');


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

    if (_.isUndefined(req.body.name)) {
        return res.status(400).json({
            error: 'proporcione name'
        });
    }


    auxFunctions.validateEmail(req.body.email).
    then(auxFunctions.usedEmail).
    then((usedEmail) => {

        if (usedEmail) {
            return res.status(400).json({ error: 'el email ya se encuentra en uso' });
        }


        bcrypt.hash(req.body.password, config.saltRounds).then(function(hash) {
            // Store hash in your password DB. 
            db.one('INSERT INTO "user" (name , email, password) VALUES ($1, $2, $3 ) RETURNING id', [req.body.name, req.body.email, hash]).
            then((result) => {

                let payload = {
                    userId: result.id
                }
                let jwt = jsonwebtoken.sign(payload, config.secret, config.optionsJWT, (err, token) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ error: "server error" })
                    }
                    return res.status(201).json({ token: token });

                });


            }).catch((err) => {
                console.log(err);
                if (err.code === '23505' && err.constraint === 'user_email_key') {
                    console.log('duplicado');
                    return res.status(400).json({ error: 'email se encuentra en uso' });
                }
            });


        });
    }).
    catch((err) => {
        return res.status(err.status).json({ error: err.message })
    });

});

module.exports = router;