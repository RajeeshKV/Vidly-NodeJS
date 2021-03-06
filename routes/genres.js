const express = require('express');
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();
router.get('/', auth, async (req, res)=> {
        const genres = await Genre.find().sort({name: 1});
        res.send(genres);
});

router.get('/:id', auth, async (req, res) => {
        const genre = await Genre.findById(req.params.id);
        res.send(genre);
});

router.post('/', [auth, admin], async (req, res) => {
        const {error} = validate(req.body);

        if(error) return res.status(400).send(error.details[0].message);

        const genre = new Genre({ name: req.body.name });
        await genre.save();
        res.send(genre);
});

router.put('/:id', [auth, admin], async (req, res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true
        });

        if(!genre) return res.status(404).send('Genre with given ID not found');

        res.send(genre);
 });

router.delete('/:id', [auth, admin], async (req, res) => {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        
        if(!genre) return res.status(404).send('The course with given ID not found');

        res.send(genre);
});


module.exports = router;