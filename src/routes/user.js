"use strict";
require('dotenv').config();
const express = require('express');
const User = require('./../models/User');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/checkUser', async (req, res) => {
    try {
        const user = await User.findById(req.body._id);
        if (user) {
            let token = jwt.sign({
                user: user
            }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });
            res.json({
                ok: true,
                user: user,
                token: token
            });
        } else {
            res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

app.post('/updateLanguage', async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        user.language = req.body.newLanguageCode;
        await user.save();
        res.json({ ok: true, message: 'Language updated successfully', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = app;
