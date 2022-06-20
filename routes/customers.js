const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const {Customer, validate} = require('../models/customer');
const router = express.Router();


router.get('/', auth, async (req,res) =>{
        const customer = await Customer.find().sort({name: 1});
        res.send(customer);
});

router.get('/:id', auth, async (req,res) => {
        const customer = await Customer.findById(req.params.id)
        if (!customer) res.status(404).send('The Customer with given ID not found');
        res.send(customer);
});

router.post('/', auth, async (req,res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const customer = new Customer({isGold: req.body.isGold, name: req.body.name, phone: req.body.phone});
        await customer.save();
        res.send(customer);
});

router.put('/:id', [auth, admin], async (req,res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        },
        {
            new: true
        });
        if (!customer) return res.status(404).send('The customer with given ID not found');

        res.send(customer);
});

router.delete('/:id', [auth, admin], async (req,res) => {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) return res.status(404).send('The customer with given ID not found');
        res.send(customer);
});

module.exports = router; 