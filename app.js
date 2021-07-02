const Express = require('Express');
const app = Express();
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const connectDB = require('./config/db');
connectDB();

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

app.use('/', require('./routes/urls'));
app.use('/', require('./routes/index'));
// app.use('/api', require('./routes/apiurls'));



// Server Setup
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});