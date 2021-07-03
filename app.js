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
    <p>Are you curius about how this app works?</p>
    <p>Check the code in <a href="https://github.com/Eloi-Perez/eloi.link">GitHub</a></p>
    </div>`);
});

app.use('/', require('./routes/urls'));
app.use('/', require('./routes/index'));
// app.use('/api', require('./routes/apiurls'));



// Server Setup
const port = process.env.PORT || 3333;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});