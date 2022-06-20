const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
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
    },
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.bool(),
        phone: Joi.string().min(10).required()
    });
    
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;