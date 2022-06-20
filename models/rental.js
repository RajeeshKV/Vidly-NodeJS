const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            isGold: { 
                type: Boolean, 
                default: false
            },
            name: {
                type: String, 
                required: true,
                minlength: 3,
                maxlength: 50
            },
            phone: {
                type: String,
                minlength: 10,
                maxlength: 10,
                required: true
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: { 
                type: String,
                minlength: 3,
                maxlength: 50,
                required: true,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                default: 0
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateRental(rental){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;