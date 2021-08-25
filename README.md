# eloi.link
#### An easy to use and fast URL shortener

![web image](https://github.com/Eloi-Perez/eloi.link/blob/assets/eloi.link.png)


### For creating a link:

Use the form on https://eloi.link, or

use GET https://eloi.link/to?url=<url_to_be_shorten>

You can also use the parameter json=true (https://eloi.link/to?json=true&url=<url_to_be_shorten>)

The web form will encode the URL so, if you are requesting directly to the API, your URLs with parameters need to be encoded first or encode at least the symbol "&" (substitute for "%26"). In JavaScript I recommend using encodeURIComponent() for the encoding.


## Technologies used:
* Node.js
* Express
* Mongoose
* NanoID
* QRcode
* HTML Template strings

The response HTML is generated dynamically in Node, using plain JS.


### Local Developing and testing

If you want to use this app on your own hosting you will need a MongoDB database and to add in your server 2 environment variables:
* BASE=http://<your_domain> (or with https)
* MONGO_URI=mongodb+srv://<your_user>:<your_password>@<your_cluster>.<mongo_code>.mongodb.net/<your_collection>?retryWrites=true&w=majority
(you can find your MONGO_URI in cloud.mongodb.com > your cluster > CONNECT)

For localhost testing, you can use a .env file inside the config folder with these two strings.
