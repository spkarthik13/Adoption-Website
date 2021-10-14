// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/registration');
const Blogs = require('../models/blogs');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    let homepageBlogs = await Blogs.find({}).sort({'createdAt': 'desc'});
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
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log(salt, hashedPassword);
            newUser = new Users({
                fullName: fullName,
                email: email,
                phoneNumber: phNumber,
                hashedPass: hashedPassword,
                gender: gender,
                address: address
            });
        } catch {
            console.log('Error creating hashed password.');
        };
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
    const User = await Users.findOne({email});
    if (User === null) {
        res.render(path.resolve('./views/error_page.ejs'), {error: 'loginError'});
    } else {
        let comparedPass = await bcrypt.compare(password, User.hashedPass);
        if (comparedPass) {
            console.log(`User ${User.fullName} has successfully logged in.`);
            req.session.user = User;
            res.redirect('/');
    } else {
        res.render(path.resolve('./views/error_page.ejs'), {error: 'loginError'});
    }
}});

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