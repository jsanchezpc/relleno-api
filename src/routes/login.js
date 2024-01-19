"use strict";
require('dotenv').config();
const express = require('express');
const User = require('./../models/User');
const bcrypt = require('bcrypt');
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

// user login
app.post('/login', (req, res) => {
    let body = req.body;
    console.log(req.body)
    User.findOne({ email: body.email })
        .then(userDb => {
            if (!userDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Incorrect email or password'
                    }
                });
            }

            if (!bcrypt.compareSync(body.password, userDb.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Incorrect email or password'
                    }
                });
            }
            if (userDb.online === false) {
                userDb.online = true;
            }

            let token = jwt.sign({
                user: userDb
            }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });
            return res.json({
                ok: true,
                user: userDb,
                token: token
            });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        });
});


// user signup
app.post('/signup', (req, res) => {
    let body = req.body;
    // if (body.password !== body.repeatPassword) {
    //     return res.json({
    //         ok: false,
    //         error: "Password must match."
    //     })
    // }

    if (body.username == "" || body.username.length <= 1) {
        return res.json({
            ok: false,
            error: "Choose a longer username please."
        })
    }

    if (!body.email || body.email.length <= 4) {
        res.json({
            ok: false,
            msg: "Wrong email"
        })
    }

    const check = /^[A-Za-z]\w{8,32}$/;
    if (body.password !== '' || body.password.match(check)) {
        let newUser = new User({
            username: body.username,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            language: body.language
        });
        newUser.save()
            .then(userDB => {
                console.log('New user!')
                let token = jwt.sign({
                    ok: true,
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

                res.json({
                    ok: true,
                    user: userDB,
                    token: token
                });
            })
            .catch(err => {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            });
    } else {
        res.json({
            ok: false,
            err: 'Wrong password!'
        });
    }
});


module.exports = app;
