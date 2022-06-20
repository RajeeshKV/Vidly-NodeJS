const express = require('express');
const mongoose = require('mongoose');
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();
 

router.get('/', auth, asyncMiddleware(async (req,res) =>{
        const movie = await Movie.find().sort({name: 1});
        res.send(movie);
}));

router.get('/:id', auth, asyncMiddleware(async (req,res) => {
        const movie = await Movie.findById(req.params.id)
        if (!movie) res.status(404).send('The movie with given ID not found');
        res.send(movie);
}));

router.post('/', [auth, admin], asyncMiddleware(async (req,res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findById(req.body.genreId);
        if(!genre) return res.status(400).send('Invalid Genre!');

        const movie = new Movie({
            title: req.body.title, 
            genre: {
                _id: genre._id,
                name: genre.name
            }, 
            numberInStock: req.body.numberInStock, 
            dailyRentalRate: req.body.dailyRentalRate
        });
        await movie.save();
        res.send(movie);
}));

router.put('/:id', [auth, admin], asyncMiddleware(async (req,res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
        {
            new: true
        });
        if (!movie) return res.status(404).send('The movie with given ID not found');

        res.send(movie);
}));

router.delete('/:id', [auth, admin], asyncMiddleware(async (req,res) => {
        const movie = await movie.findByIdAndRemove(req.params.id);
        if (!movie) return res.status(404).send('The movie with given ID not found');
        res.send(movie);
}));

module.exports = router; 