var nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

module.exports = function(message,cb){
    transporter.sendMail(message,function(err, data){
        if(err) return cb(err,'');
        cb(null,data);
    });
};