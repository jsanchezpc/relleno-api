"use strict";
require('dotenv').config();
const express = require('express');
const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// user login
app.post('/createPoll', (req, res) => {
    let body = req.body;
    res.json({
        ok: true,
        msg: "Poll created correctly"
    })
});


module.exports = app;
