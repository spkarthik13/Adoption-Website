const mongoose = require('mongoose');

let MongoDB = mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(res => {
    console.log('Successfully connected to the database.');
}).catch(err => {
    console.log(`Error connecting to the database: ${err}.`);
});

module.exports = MongoDB;