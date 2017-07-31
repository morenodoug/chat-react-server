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

function signup(req, res, next) {
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
                jsonwebtoken.sign(payload, config.secret, config.optionsJWT, (err, token) => {
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

}

function signin(req, res, next) {

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

    db.any('SELECT id, email, password FROM "user" WHERE email=$1', [req.body.email]).
    then((data) => {
        if (data.length === 0) {
            return res.status(401).json({ error: " email o password incorrecto" });
        }
        console.log(data[0].password);



        bcrypt.compare(req.body.password, data[0].password).
        then((response) => {
            console.log(response);

            if (!response)
                return res.status(401).json({ error: "meail o possword incorrecto" });

            let payload = {
                userId: data[0].id
            }

            jsonwebtoken.sign(payload, config.secret, config.optionsJWT, (err, token) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: "server error" })
                }
                return res.status(201).json({ token: token });
            });

        }).
        catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "server error" });
        });

    }).catch((err) => {
        console.log(`cae en error ${err}`);
        return res.status(500).json({ error: "server error" });
    });





}

module.exports = {
    signup: signup,
    signin: signin
}