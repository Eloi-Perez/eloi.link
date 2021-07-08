# eloi.link
#### An easy to use and fast URL shortener

### For creating a link:
Go to https://eloi.link/to?url=<url_to_be_shorten>

(Add your url after the =)

You can also use the parameter json=true (https://eloi.link/to?json=true&url=<url_to_be_shorten>)


### About
This project uses Node, Express, Mongoose, NanoID and QRcode.

If you want to use this app on your own hosting you will need a MongoDB database and to add in your server 2 environment variables:
* BASE=http://<your_domain> (or with https)
* MONGO_URI=mongodb+srv://<your_user>:<your_password>@<your_cluster>.<mongo_code>.mongodb.net/<your_collection>?retryWrites=true&w=majority
(you can find your MONGO_URI in cloud.mongodb.com > your cluster > CONNECT)

For localhost testing, you can use a .env file inside the config folder with these two strings.
