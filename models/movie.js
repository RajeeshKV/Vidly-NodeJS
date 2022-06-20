const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');
const auth = require('../middleware/auth');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: { 
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        default: 0
    }
}));

function validateMovie(Movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(100),
        dailyRentalRate: Joi.number().min(0)
    });
    
    return schema.validate(Movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;