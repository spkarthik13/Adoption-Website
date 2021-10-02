const express = require('express');
const router = express.Router();
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const sessionStore = new MongoDBSession({
    uri: process.env.DB_URI,
    collection: "Sessions"
});

router.use(session({
    secret: "example",
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
}));

module.exports = router;