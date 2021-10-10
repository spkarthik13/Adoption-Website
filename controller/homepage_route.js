// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/registration');
const Blogs = require('../models/blogs');

router.get('/', async (req, res) => {
    let homepageBlogs = await Blogs.find({});
    if (req.session.user) {
        res.render(path.resolve('./views/homepage.ejs'), {user: req.session.user, blogs: homepageBlogs});
    } else {
        res.render(path.resolve('./views/homepage.ejs'), {user: undefined, blogs: homepageBlogs});
    }
});

// Two below routes are on the homepage, but are more suited to a login route. Could possibly break these two routes into their own file.
router.post('/newUser', async (req, res) => {
    const {fullName, email, password, phNumber, gender, address} = req.body;
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
        gender: gender,
        address: address
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
    let User = await Users.findOne({email});
    if (User && User.password === password) {
        console.log(`User ${User.fullName} has successfully logged in.`);
        req.session.user = User;
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
    });

    res.clearCookie(process.env.SESSION_SECRET);
    res.redirect('/');
});

module.exports = router;