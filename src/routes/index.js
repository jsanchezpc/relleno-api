const express = require('express');
const app = express();


// login
app.use(require('./login'));

// user
app.use(require('./user'));

// ask gemini
app.use(require('./ai-model'));


module.exports = app;