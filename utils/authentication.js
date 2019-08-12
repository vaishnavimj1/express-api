var jwt = require('jsonwebtoken');
require('dotenv').config();
var User = require('./../models/User');

module.exports = function (req, res, next) {
    /*
        Check if the token is passed,
        if yes, then verify JWT Token 
        passed in the request headers and 
        attach user data in req.user parameter
    */

    if (!req.headers || !req.headers.token) {
        return res.status(422).json({
            message: "The token is required.",
            data: ""
        });
    }
    jwt.verify(
        req.headers.token,
        process.env.JWT_SECRET,
        function (err, user) {
            if (err) {
                if(err.name === "JsonWebTokenError") {
                    return res.status(442).json({
                        message: "The user is not authorised or expired token.",
                        data: ""
                    });
                }
                return next(err);
            }

            if (!user) {
                return res.status(442).json({
                    message: "The user is not authorised or expired token.",
                    data: ""
                });
            }
            User.findById(user.id, function (err, user) {
                if (err) return next(err);

                req.user = user;
                next();
            });
        });

}