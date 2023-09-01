const express = require('express');
const { User } = require('../modules/users');
const bcrypt = require('bcrypt');
const router = express.Router();
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

//api/auth
router.post('/', async (req, res) => {
    const { error } = await userAuth(req.body);
    if (error) return res.status(400).send(error.message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is invalid!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email or password is invalid!');

    const token = user.generateAuthKey();

    res.status(200).send(token);
})

const complexityOptions = {
    min: 8,
    max: 70,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2
};

const userAuth = async (req) => {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: passwordComplexity(complexityOptions).min(8).max(70).required()
    })
    return schema.validate(req);
}

module.exports = router;