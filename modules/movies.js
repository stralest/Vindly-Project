const mongoose = require('mongoose');
const { genreSchema } = require('./genres');
const Joi = require('joi');


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

const Movies = mongoose.model('Movies', movieSchema);

const validatePostMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        //genre: Joi.object().required(),
        genreID: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255)
    })

    return schema.validate(movie);
}

const validateUpdateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        genreName: Joi.string().min(3).max(255).required(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255)
    })

    return schema.validate(movie);
}

module.exports.validatePost = validatePostMovie;
module.exports.validateUpdate = validateUpdateMovie;
module.exports.Movies = Movies;