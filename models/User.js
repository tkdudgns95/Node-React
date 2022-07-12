const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },

    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type:Number
    }

})

userSchema.pre('save', function( next ){
    // 비밀번호를 암호화 시킨다.
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)
    
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
                // Store hash in your password DB.


             })
        })
    } else {
        next()
    }
})


    
userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword 1234566    암호화된 비밀번호 $2b$10$KZNca1l0GJGn4MMq8MO2.OlPxGUdL4poJHnemxuhfLKqZw7V2H9Oy
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err),
        cb(null, isMatch)
    })


}



const User = mongoose.model('User', userSchema)

module.exports = {User}