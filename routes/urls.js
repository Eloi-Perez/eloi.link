const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
// const generate = require('nanoid/generate')

const Url = require('../models/Url');
const utils = require('../utils/utils');
require('dotenv').config({ path: '../config/.env' });

// Short URL Generator

const responseHtml = function (origUrl, shortUrl, urlId, date, clicks) {
let pDate, pClicks;
if (date) {
    pDate = `<p>Creation Date: ${date}</p>`
} else { pDate = ''}
if (clicks) {
    pClicks = `<p>Clicks: ${clicks}</p>`
} else { pClicks = ''}

return `<!DOCTYPE html><html lang="en">
<head>
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
<p>Origin Url: ${origUrl}</p>
${pClicks}
${pDate}

</body>
</html>`
};

router.get('/to', async (req, res) => {
    const origUrl = req.query.url;
    const base = process.env.BASE;
    let urlId = nanoid(4);
    // let urlId = generate('1234a', 4); //to limit or expand the dictionary

    if (utils.validateUrl(origUrl)) {
        try {
            let findUrl = await Url.findOne({ origUrl });
            if (findUrl) {
                // res.json({ clicks: findUrl.clicks, origUrl: findUrl.origUrl, shortUrl: findUrl.shortUrl, crationDate: findUrl.date });
                res.send(responseHtml(findUrl.origUrl, findUrl.shortUrl, findUrl.urlId, findUrl.date, findUrl.clicks));
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
                    // res.send(`<a href="${url.shortUrl}"><h1 style="text-align: center;">eloi.link/${urlId}</h1></a>`);
                    res.send(responseHtml(url.origUrl, url.shortUrl, url.urlId));
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
                            // res.send(`<a href="${url.shortUrl}"><h1 style="text-align: center;">eloi.link/${urlId}</h1></a>`);
                            res.send(responseHtml(url.origUrl, url.shortUrl, url.urlId));
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