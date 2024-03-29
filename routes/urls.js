const express = require('express');
const router = express.Router();
const path = require('path');
const { nanoid } = require('nanoid');
// import { customAlphabet } from 'nanoid'
const QRCode = require('qrcode');

const Url = require('../models/Url');
const utils = require('../utils/utils');
require('dotenv').config({ path: '../config/.env' });


const responseHtml = async function (origUrl, shortUrl, urlId, date, clicks) {
    let scriptDate, pClicks, html;
    try {
        let toQR = async (str) => QRCode.toDataURL(str); // (str, { version: 2 })  // default size
        let qrImage = await toQR(shortUrl);
        let scriptImgSrc = `
        let qrImg = document.querySelector('.qrcode img').src;
        document.querySelector('.qrcode').href = qrImg;
        `

        if (date) {
            scriptDate = `
        let localTimeDate = new Date('${date}');
        let divDate = document.querySelector('.divDate');
        let p = document.createElement('p');
        p.innerText = 'Creation Date: ' + localTimeDate;
        divDate.appendChild(p);
        `
        } else { scriptDate = '' }

        if (clicks) {
            pClicks = `<p>Clicks: ${clicks}</p>`
        } else { pClicks = '' }

        html = /*html*/`<!DOCTYPE html><html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eloi.link</title>
    <link rel="stylesheet" type="text/css" href="/styles.css">
</head>
<body>
    <h1><a href="${shortUrl}">eloi.link/${urlId}</a></h1>
    <a class="qrcode" download="QRcode.png"><img src=${qrImage}></a>
    <p>Origin Url: ${origUrl}</p>
    <div>${pClicks}</div>
    <div class="divDate"></div>
    <h3><a href="/">Create a new link</a></h3>
    <script>
    ${scriptImgSrc}${scriptDate}
    </script>
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
    // let urlId = nanoid(4);
    // let urlId = customAlphabet('1234a', 4); //to limit or expand the dictionary
    const responseJson = req.query.json;

    if (utils.validateUrl(origUrl)) {
        try {
            let findUrl = await Url.findOne({ origUrl });
            if (findUrl) {
                if (responseJson === 'true') {
                    return res.json({ clicks: findUrl.clicks, origUrl: findUrl.origUrl, shortUrl: findUrl.shortUrl, creationDate: findUrl.date });
                }
                return res.send(await responseHtml(findUrl.origUrl, findUrl.shortUrl, findUrl.urlId, findUrl.date, findUrl.clicks));
            } else {
                let len = 4;
                async function create() {
                    let urlId = nanoid(len);
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
                            return res.json({ origUrl: url.origUrl, shortUrl: url.shortUrl, creationDate: url.date });
                        }
                        return res.send(await responseHtml(url.origUrl, url.shortUrl, url.urlId));

                    } catch (err) {
                        if (err.code === 11000) { // if Duplicate shortUrl
                            len += 1;
                            create();
                        } else {
                            console.log(err);
                            return res.status(500).json('Server Error');
                        }
                    }
                }
                create();
            }
        } catch (err) {
            console.log(err);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(400).sendFile('/invalid.html', { root: path.resolve('public') });
    }
});

module.exports = router;