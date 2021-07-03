# eloi.link

This project was created using Node, Express, Mongoose and NanoID.

If you want to use this app on your own hosting you will need a MongoDB database (there is free tiers on https://account.mongodb.com) 
and add in your server 2 environment variables:
* BASE=http://<your_domain>
* MONGO_URI=mongodb+srv://<your_user>:<your_password>@<your_cluster>.<mongo_code>.mongodb.net/<your_collection>?retryWrites=true&w=majority
(you can find your MONGO_URI in cloud.mongodb.com > your cluster > CONNECT)

For localhost testing you can use a .env file inside the config folder with this 2 strings.



### For creating a link:
Go to http://<your_domain>/to?url=<url_to_be_shorten.com>
