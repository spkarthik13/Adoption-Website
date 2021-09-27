// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/registration');

// TODO: Research how to do a proper PUT request to let the user update this info, have no yet done PUT until this point.

router.get('/userProfile', async (req, res) => {
    let userEmail = req.session.email;
    let User = await Users.findOne({userEmail});

    // TODO, maybe break out of function and declare as a JS Object.
    let userInfo = {
        fullName: User.fullName,
        email: User.email, 
        phoneNumber: User.phoneNumber,
        password: User.password,
        address: User.address,
        gender: User.gender,
    }
    res.render(path.resolve('./views/userProfile.ejs'), {name: req.session.username, user: userInfo});
});

module.exports = router;