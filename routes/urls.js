const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
// const generate = require('nanoid/generate')
const QRCode = require('qrcode');

const Url = require('../models/Url');
const utils = require('../utils/utils');
require('dotenv').config({ path: '../config/.env' });


const responseHtml = async function (origUrl, shortUrl, urlId, date, clicks) {
    let pDate, pClicks, html;
    try {
        if (date) {
            pDate = `<p>Creation Date: ${date}</p>`
        } else { pDate = '' }
        if (clicks) {
            pClicks = `<p>Clicks: ${clicks}</p>`
        } else { pClicks = '' }

        let toQR = async (str) => QRCode.toDataURL(str); // (str, { version: 2 })  // default size


        html = `<!DOCTYPE html><html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>eloi.link</title>
                <style>
                    body {
                        background-color: DarkSlateBlue;
                        color: azure;
                        text-align: center;
                    }
                    a {
                        color: white;
                    }
                </style>
            </head>
            <body>
                <h1><a href="${shortUrl}">eloi.link/${urlId}</a></h1>
                <img src=${await toQR(shortUrl)}>
                <p>Origin Url: ${origUrl}</p>                
                ${pClicks}
                ${pDate}
            </body>
            </html>`;

    } catch (err) {
        console.error(err)
    }

    return html;
};

router.get('/to', async (req, res) => {
    const origUrl = decodeURIComponent(req.query.url);
    const base = process.env.BASE;
    let urlId = nanoid(4);
    // let urlId = generate('1234a', 4); //to limit or expand the dictionary
    const responseJson = req.query.json;

    if (utils.validateUrl(origUrl)) {
        try {
            let findUrl = await Url.findOne({ origUrl });
            if (findUrl) {
                if (responseJson === 'true') {
                    return res.json({ clicks: findUrl.clicks, origUrl: findUrl.origUrl, shortUrl: findUrl.shortUrl, crationDate: findUrl.date });
                }
                return res.send(await responseHtml(findUrl.origUrl, findUrl.shortUrl, findUrl.urlId, findUrl.date, findUrl.clicks));
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
                    if (responseJson === 'true') {
                        return res.json({ origUrl: url.origUrl, shortUrl: url.shortUrl, crationDate: url.date });
                    }
                    return res.send(await responseHtml(url.origUrl, url.shortUrl, url.urlId));
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
                            if (responseJson === 'true') {
                                return res.json({ origUrl: url.origUrl, shortUrl: url.shortUrl, crationDate: url.date });
                            }
                            return res.send(await responseHtml(url.origUrl, url.shortUrl, url.urlId));
                        } catch (err) {
                            console.log(err);
                            return res.status(500).json('Server Error');
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