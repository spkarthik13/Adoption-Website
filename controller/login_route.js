// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/user');
const bcrypt = require('bcrypt');

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

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
    });

    res.clearCookie(process.env.SESSION_SECRET);
    res.redirect('/');
});

module.exports = router;