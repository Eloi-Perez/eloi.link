const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
// const generate = require('nanoid/generate')

const Url = require('../models/Url');
const utils = require('../utils/utils');
require('dotenv').config({ path: '../config/.env' });

// Short URL Generator

router.get('/to', async (req, res) => {
    const origUrl = req.query.url;
    const base = process.env.BASE;
    let urlId = nanoid(4);
    // let urlId = generate('1234a', 4); //to limit or expand the dictionary

    if (utils.validateUrl(origUrl)) {
        try {
            let findUrl = await Url.findOne({ origUrl });
            if (findUrl) {
                res.json({ clicks: findUrl.clicks, origUrl: findUrl.origUrl, shortUrl: findUrl.shortUrl, crationDate: findUrl.date });
            } else {
                try {
                    const shortUrl = `${base}/${urlId}`;
                    let url = new Url({
                        origUrl,
                        shortUrl,
                        urlId,
                        date: new Date(),
                    });
                    await url.save();
                    res.send(`<a href="${url.shortUrl}"><h1 style="text-align: center;">eloi.link/${urlId}</h1></a>`);
                } catch (err) {
                    if (err.code === 11000) { // if Duplicate shortUrl
                        try {
                            console.log('replacing ID...');
                            urlId = nanoid(5);
                            const shortUrl = `${base}/${urlId}`;
                            let url = new Url({
                                origUrl,
                                shortUrl,
                                urlId,
                                date: new Date(),
                            });
                            await url.save();
                            res.send(`<a href="${url.shortUrl}"><h1 style="text-align: center;">eloi.link/${urlId}</h1></a>`);
                        } catch (err) {
                            console.log(err);
                            res.status(500).json('Server Error');
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(400).json('Invalid Original Url');
    }
});

module.exports = router;