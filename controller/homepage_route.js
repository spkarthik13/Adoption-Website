// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/registration');

router.get('/', (req, res) => {
    res.render(path.resolve('./views/homepage.ejs'));
});

router.post('/newUser', async (req, res) => {
    const {fullName, email, password, phNumber} = req.body;

    let newUser = await Users.findOne({email});

    if (newUser) {
        console.log("User already exists in database.");
        res.redirect('/');
    } else {

    newUser = new Users({
        fullName: fullName,
        email: email,
        phoneNumber: phNumber,
        password: password,
    });

    newUser.save()
        .then((result) => {
            console.log("New user successfully added to the database: " + result);
            res.redirect('/');
        })
        .catch((error) => {
            console.log("Error adding user to the database: " + error);
        })
}});

module.exports = router;