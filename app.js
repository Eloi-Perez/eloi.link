const express = require('express');
const secure = require('express-force-https');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const app = express();
app.use(secure);

const connectDB = require('./config/db');
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<div style="text-align: center;">
    <h1>Hello</h1>
    <p>Are you curious about how this app works?</p>
    <p>Check the code in <a href="https://github.com/Eloi-Perez/eloi.link">GitHub</a></p>
    </div>`);
});

app.use('/favicon', (req, res) => { res.sendFile( __dirname + '/images/favicon.png') });
app.use('/favicon.png', (req, res) => { res.sendFile( __dirname + '/images/favicon.png') });
app.use('/favicon.ico', (req, res) => { res.sendFile( __dirname + '/images/favicon.png') });

app.use('/', require('./routes/urls'));
app.use('/', require('./routes/index'));



// Server Setup
const port = process.env.PORT || 3333;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});