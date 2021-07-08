const express = require('express');
const secure = require('express-force-https');
require('dotenv').config({ path: './config/.env' });

const app = express();
app.use(secure);

const connectDB = require('./config/db');
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use('/favicon', (req, res) => { res.sendFile( __dirname + '/images/favicon.png') });
app.use('/favicon.png', (req, res) => { res.sendFile( __dirname + '/images/favicon.png') });
app.use('/favicon.ico', (req, res) => { res.sendFile( __dirname + '/images/favicon.png') });

app.use('/', require('./routes/urls'));
app.use('/', require('./routes/index'));

app.use(function (req, res, next) {
    console.log('404');
    res.status(404).sendFile('/public/404.html', { root: __dirname });
});

// Server Setup
const port = process.env.PORT || 3333;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});