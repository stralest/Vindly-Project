const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
})

const Genres = mongoose.model('Genres', genreSchema);


const validateData = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required()
    })

    return schema.validate(genre);
}

module.exports.Genres = Genres;
module.exports.validate = validateData;
module.exports.genreSchema = genreSchema;