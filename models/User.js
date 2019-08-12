var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    userName: String,
    email: String,
    password: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,
    resetLink: String
});

userSchema.pre('save', function(next){
    var user = this;
    
    // only hash password if it is new
    if(!user.isNew) return next();
    
    if(!user.password) return next();

    // hashing the password with 10 rounds of salt generation
    bcrypt.hash(
        user.password, 
        10, 
        function(err, hash){
            if(err) return next(err);

            user.password = hash;
            next();
    });
});

userSchema.methods.comparePassword = function(userPassword, cb){
    bcrypt.compare(userPassword, this.password,function(err, isMatch){
        return cb(err, isMatch);
    });
}

module.exports = mongoose.model('User',userSchema);