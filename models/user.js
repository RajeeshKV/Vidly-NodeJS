const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const Joipassword = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email: {
        type: String, 
        required: true,
        minlength: 6,
        maxlength: 255,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 6,
        maxlength: 1050,
        required: true
    },
    isAdmin : {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}


const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    });
    
    return schema.validate(user) && Joipassword().validate(user.password);
}

function validateAuth(user) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    });
    
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.validateAuth = validateAuth;