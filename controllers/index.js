var randomstring = require("randomstring");
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");
var User = require('./../models/User');
var { sendMail } = require('./../utils/index');

module.exports = {
  register: function (req, res, next) {
    var { userName, email } = req.body;
    User.findOne({
      $or: [
        { userName }, { email }
      ]
    }, function (err, user) {
      if (err) return next(err);

      if (user) {
        return res.status(200).json({
          message: "User Name or Email Already Taken",
          data: ""
        });
      }

      var verificationCode = randomstring.generate({
        length: 30,
        charset: 'alphanumeric'
      });

      req.body.verificationCode = verificationCode;

      User.create(req.body, (err, data) => {
        if (err) return next(err);
        res.status(200).json({
          message: "User Registered Successfully",
          data: ""
        });

        sendMail({
          from: process.env.SMTP_FROM_MAIL,
          to: data.email,
          subject: 'Account Verification Mail',
          text: `Here is your link 
            http://localhost:${process.env.PORT}/account/verification/${verificationCode}
          `
        }, function (err, data) {
          if (err) return next(err);
          console.log("Mail Delivery Receipt----->", data);
        });
      });
    });
  },
  accountVerification: function (req, res, next) {

    User.updateOne({
      verificationCode: req.params.code
    }, {
        $set: {
          isVerified: true
        },
        $unset: {
          verificationCode: ''
        }
      }, function (err, user) {
        if (err) return next(err);


        if (!user.nModified) {
          return res.status(422).json({
            message: "Link Expired or Invalid",
            data: ""
          });
        }

        res.status(200).json({
          "message": "Account Verified Successfully",
          "data": ""
        });
      });
  },
  login: function (req, res, next) {
    var { email, password } = req.body;
    User.findOne({
      email,
      isVerified: true
    }, function (err, user) {
      if (err) return next(err);

      if (!user) {
        return res.status(200).json({
          message: "User Not Found",
          data: ""
        });
      }

      user.comparePassword(password, function (err, isMatch) {
        if (err) return next(err);

        if (isMatch) {
          return res.status(200).json({
            message: "User Login Successfully",
            data: {
              userName: user.userName,
              email: user.email,
              token: jwt.sign({
                id: user._id
              }, process.env.JWT_SECRET)
            }
          });
        }

        return res.status(200).json({
          message: "Email or Password Incorrect",
          data: ""
        });
      });
    });
  },
  profile: function (req, res, next) {
    var { userName, email } = req.user
    return res.status(200).json({
      message: "Activity Successfull",
      data: {
        userName,
        email
      }
    });
  },
  forgotPassword: function (req, res, next) {
    User.findOne({
      email: req.body.email,
      isVerified: true
    }, function (err, user) {
      if (err) return next(err);

      if (!user) {
        return res.status(200).json({
          message: "User Not Found",
          data: ""
        });
      }

      var resetCode = randomstring.generate({
        length: 30,
        charset: 'alphanumeric'
      });
      
      var resetLink = `${resetCode}.${user._id}.${Date.now()}`

      User.updateOne({
        _id: user._id
      },{
        $set:{
          resetLink
        }
      },function(err, data){
        if (err) return next(err);

        res.status(200).json({
          message: "An email is sent to your inbox, if it doesn't appear check your spam folder",
          data: ""
        });

        sendMail({
          from: process.env.SMTP_FROM_MAIL,
          to: user.email,
          subject: 'Reset Your Password',
          text: `Here is your link 
            http://localhost:${process.env.PORT}/reset_password/${resetLink}`
        }, function (err, data) {
          if (err) return next(err);
          console.log("Mail Delivery Receipt----->", data);
        });
      });
    });
  },
  resetPassword: function (req, res, next) {
    var { resetLink } = req.params;
    var [, userId, date] = resetLink.split('.');
    var { password } = req.body;
    User.findOne({
      resetLink
    }, function(err, user){
      if (err) return next(err);

      if (
        !user || 
        (
          (Date.now() - date * 1) > 3 * 60 * 60 * 1000
        )
      ) {
        return res.status(200).json({
          message: "Link Expired or Invalid",
          data: ""
        });
      }
  
      bcrypt.hash(
        password,
        10,
        function (err, hash) {
          if (err) return next(err);
  
          User.updateOne({
            _id: userId
          },{
            $set:{
              password: hash
            },
            $unset:{
              resetLink: ''
            }
          }, function(err, user){
            if (err) return next(err);
  
            res.status(200).json({
              message: "Password Set Successfully",
              data: ""
            });
  
          });
        });
    });
  }
};