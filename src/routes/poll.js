"use strict";
require("dotenv").config();
const express = require("express");
const Poll = require("./../models/Poll");
const Auth = require("../middlewares/Auth");
const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const app = express();

// Poll processing
app.post("/createPoll", Auth, async (req, res) => {
  try {
    const poll = req.body;
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

// Send poll list
app.post("/syncPollList", Auth, async (req, res) => {

  console.log(req.body)
  try {
    const user = req.body.user.username;

    const polls = await Poll.find({ author: user });
    console.log(polls)

    if (polls.length === 0) {
      return res.status(404).json({ message: "No polls found for this user" });
    }

    res.status(200).json({
      ok: true,
      pollList: polls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
