require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
const { configDotenv } = require('dotenv');
// const cloudinary = require('cloudinary');

const app = express();

// const http = require('http').createServer(app);
// // sockets
// const io = require('socket.io')(http, {
//     cors: {
//         origins: [`http://localhost:${process.env.APP_PORT}`]
//     }
// });


// use cors
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// watch events
app.use(morgan('combined'));
// json parser
app.use(express.json());

// routes
app.use(require('./src/routes/index'));


// SET HEADERS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${process.env.APP_PORT}`);
    next();
});

// connect to database
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}
connectToDatabase();

// // CLOUDINARY
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET
// });


// start listening
app.listen(process.env.PORT, () => console.log(`Server listening port ${process.env.PORT}..........`));