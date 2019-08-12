let Validator = require('validatorjs');

module.exports = function(rules){
    return function(req, res, next){
        let validation = new Validator(
            req.body, 
            rules
        );
    
        if(validation.fails()) {
            var error = validation.errors.all();
            return res.status(422).json({
                data: {},
                message: error[Object.keys(error)[0]][0]
            });
        }
        return next();
    };
};