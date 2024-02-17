"use strict";
require('dotenv').config();
const express = require('express');
const Poll = require('./../models/Poll');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const app = express();

// Poll processing
app.post('/createPoll', (req, res) => {
    let body = req.body;
    console.log(body)
    res.json({
        ok: true,
        msg: "Poll created correctly"
    })
});


module.exports = app;
