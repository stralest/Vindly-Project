const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    },
    isGold: {
        type: Boolean,
        default: false,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    }
})

const Customers = mongoose.model('Customers', schema);


const validateData = (param) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(30).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(30).required()
    })

    return schema.validate(param);
}

module.exports.Customers = Customers;
module.exports.validate = validateData;