// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/registration');

router.get('/', (req, res) => {
    if (req.session.isLoggedIn) { // If user has logged in, render page with username.
        res.render(path.resolve('./views/homepage.ejs'), {name: req.session.username});
    } else {
        res.render(path.resolve('./views/homepage.ejs'), {name: undefined});
    }
});

// Two below routes are on the homepage, but are more suited to a login route. Could possibly break these two routes into their own file.
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

router.post('/loginUser', async (req, res) => {
    const {email, password} = req.body;
    let loginUser = await Users.findOne({email});
    if (loginUser && loginUser.password === password) {
        console.log(`User ${loginUser.fullName} has successfully logged in.`);
        req.session.isLoggedIn = true;
        req.session.username = loginUser.fullName;
        res.redirect('/');
    } else  {
        res.redirect('/loginError');
    }
})

module.exports = router;