const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();


Fawn.init('mongodb://localhost/Vidly');

router.get('/', auth, asyncMiddleware(async (req,res) => {
    const rental = await Rental.find().sort('-dateOute');
    res.send(rental);
}));

router.post('/', auth, asyncMiddleware(async (req,res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const customer = await Customer.findById(req.body.customerId);
        if(!customer) return res.status(400).send('Invalid Customer!');

        let movie = await Movie.findById(req.body.movieId);
        if(!movie) return res.status(400).send('Invalid Movie!');

        if(movie.numberInStock <= 0) return res.status(500).send('Movie is currently out of stock');

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        
        try{
            new Fawn.Task()
                .save('rentals', rental)
                .update('movies', {_id: movie._id}, {
                    $inc: { numberInStock: -1 }
                })
                .run();

                res.send(rental);
        }
        catch (ex){
            res.status(500).send(ex.error);
        }
}));

module.exports = router; 