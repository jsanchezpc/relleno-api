"use strict";
require("dotenv").config();
const express = require("express");
const Poll = require("./../models/Poll");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const app = express();

// Poll processing
app.post("/createPoll", async (req, res) => {
  try {
    const poll = req.body;
    console.log(typeof poll, poll);

    const newPoll = new Poll(poll);

    const savedPoll = await newPoll.save();

    res.status(201).json({
      ok: true,
      msg: "Poll created correctly",
      poll: savedPoll,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error creating poll",
      error: error.message,
    });
  }
});

module.exports = app;
