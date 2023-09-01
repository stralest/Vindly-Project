const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthKey = function () {
    const token = jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, config.get('vidly_jwtPrivateKey'));
    return token;
}

const User = mongoose.model('Users', userSchema);

const complexityOptions = {
    min: 8,
    max: 70,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2
};

const validateUser = async (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: passwordComplexity(complexityOptions).required(),
        isAdmin: Joi.boolean()
    })

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;


