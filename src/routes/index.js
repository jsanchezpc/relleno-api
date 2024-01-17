const express = require('express');
const app = express();


// login
app.use(require('./login'));

module.exports = app;