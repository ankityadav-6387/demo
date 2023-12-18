const mongoose = require('mongoose');

// const url = process.env.URL
const url = 'mongodb://127.0.0.1:27017/expense-tracker';

mongoose
    .connect(url)
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err))