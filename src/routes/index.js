const express = require('express');
const app = express();


// login
app.use(require('./login'));

// user
app.use(require('./user'));

module.exports = app;