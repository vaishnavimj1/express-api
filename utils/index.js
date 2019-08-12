var validateRequest = require('./validation');
var sendMail = require('./sendMail');
var authentication = require('./authentication');

module.exports = {
    validateRequest,
    sendMail,
    authentication
};