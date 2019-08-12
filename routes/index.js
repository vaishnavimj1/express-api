var express = require('express');
var router = express.Router();
var { 
  register: registerController,
  accountVerification: accountVerificationController,
  login: loginController,
  profile: profileController,
  forgotPassword: forgotPasswordController,
  resetPassword: resetPasswordController
} = require('./../controllers/index');
var { 
  validateRequest,
  authentication
 } = require('./../utils/index');
var { 
  register,
  login,
  forgotPassword,
  resetPassword
  } = require('./../validation_rules');

/**
 * @api {post} /login Request User Login
 * @apiName Login
 * @apiGroup Index
 *
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 *
 * @apiSuccess {String} message User Login Successfully
 * @apiSuccess {String} data 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User Login Successfully",
 *       "data": {
 *          userName: "Your username"
 *        }
 *     }
 *
 * @apiError ValidationError Please Enter The Data in Specified Format.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": "Validation Error Message"
 *     }
 */
router.post('/login', 
  validateRequest(login),
  loginController
);

/**
 * @api {post} /register Request User Registration
 * @apiName Registration
 * @apiGroup Index
 *
 * @apiParam {String} userName Name of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 *
 * @apiSuccess {String} message User Registered Successfully
 * @apiSuccess {String} data 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User Registered Successfully",
 *       "data": ""
 *     }
 *
 * @apiError ValidationError Please Enter The Data in Specified Format.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": "Validation Error Message"
 *     }
 */
router.post(
  '/register',
  validateRequest(register),
  registerController
);

/**
 * @api {get} /account/verification/:code Request Account Verification
 * @apiName Account Verification
 * @apiGroup Index
 *
 * @apiSuccess {String} message Account Verified Successfully
 * @apiSuccess {String} data 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Account Verified Successfully",
 *       "data": ""
 *     }
 *
 * @apiError LinkExpired The Verification Link is invalid or expired.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": "Link Expired or Invalid"
 *     }
 */
router.get(
  '/account/verification/:code',
  accountVerificationController
);

/**
 * @api {get} /profile Request Profile View
 * @apiName Profile View
 * @apiGroup Index
 *
 * @apiSuccess {String} message Activity Successfull
 * @apiSuccess {String} data 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Activity Successfull",
 *       "data": userData
 *     }
 *
 * @apiError AuthenticationError The user is not authorised or expired token.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "The user is not authorised or expired token."
 *     }
 */
router.get(
  '/profile',
  authentication,
  profileController
);

/**
 * @api {post} /forgot_password Request Forgot Password
 * @apiName Forgot Password
 * @apiGroup Index
 *
 * @apiParam {String} email Email of the user'
 * 
 * @apiSuccess {String} message An email is sent to your inbox, if it doesn't appear check your spam folder
 * @apiSuccess {String} data 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "An email is sent to your inbox, if it doesn't appear check your spam folder",
 *       "data": ""
 *     }
 *
 * @apiError ValidationError Validation Error Message
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Validation Error
 *     {
 *       "message": "Validation Error Message"
 *     }
 */
router.post(
  '/forgot_password',
  validateRequest(forgotPassword),
  forgotPasswordController
);

/**
 * @api {post} /reset_password/:resetLink Request Reset Password
 * @apiName Reset Password
 * @apiGroup Index
 *
 * @apiParam {String} password Password the user
 * @apiParam {String} confirmPassword Confirm Password of the user
 * @apiParam {String} resetLink Reset Link sent to the user
 * 
 * @apiSuccess {String} message Password Set Successfully
 * @apiSuccess {String} data 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Password Set Successfully",
 *       "data": ""
 *     }
 *
 * @apiError ValidationError Validation Error Message
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Validation Error
 *     {
 *       "message": "Validation Error Message"
 *     }
 */
router.post(
  '/reset_password/:resetLink',
  validateRequest(resetPassword),
  resetPasswordController
);

module.exports = router;