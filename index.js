require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
// const {GoogleAuth} = require('google-auth-library');
// const { configDotenv } = require('dotenv');
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
    const allowedOrigins = [
        `http://localhost:${process.env.APP_PORT}`,
        `http://192.168.1.118:${process.env.APP_PORT}`,
        `http://192.168.1.18:${process.env.APP_PORT}`,
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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


// /**
// * Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
// * this library will automatically choose the right client based on the environment.
// */
// async function main() {
//   const auth = new GoogleAuth({
//     scopes: 'https://www.googleapis.com/auth/cloud-platform'
//   });
//   const client = await auth.getClient();
//   const projectId = await auth.getProjectId();
//   const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`;
//   const res = await client.request({ url });
//   console.log(res.data);
// }

// main().catch(console.error);

// // CLOUDINARY
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET
// });


// start listening
app.listen(process.env.PORT, () => console.log(`Server listening port ${process.env.PORT}..........`));