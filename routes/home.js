const auth = require('../middleware/auth');
const express = require('express');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();


router.get('/', auth, (req,res) => {
    res.send('Hello World');
});

module.exports = router;