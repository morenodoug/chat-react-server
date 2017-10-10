var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = function(req, res, next) {
    //check header or url parameters or post parameters for token

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        // verifica token y el tiempo de vencimiento
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        }); //end verify
    } else {
        // no paso el token
        // return an error
        res.status(403).json({
            success: false,
            message: 'No token provided.'
        });


    }

}