"use strict";
require('dotenv').config();
const express = require('express');
const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();


// user login
app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ username: body.username })
        .then(userDb => {
            if (!userDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Incorrect (User) or password'
                    }
                });
            }

            if (!bcrypt.compareSync(body.password, userDb.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Incorrect User or (password)'
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

    const check = /^[A-Za-z]\w{8,32}$/;
    if (body.password !== '' || body.password.match(check)) {
        let newUser = new User({
            username: body.username,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            lang: body.userLang
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
