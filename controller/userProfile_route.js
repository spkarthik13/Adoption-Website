// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/registration');

router.get('/userProfile/:id', (req, res) => {
    res.render(path.resolve('./views/userProfile.ejs'), {user: req.session.user});
});

// Update route.
router.post('/userProfile/edit/:id', (req, res) => {

    // TODO: Set parameters so users cannot update fields to unrelated formats (empty fields, etc).
    let User = {
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        address: req.body.address,
        gender: req.body.gender
    };

    Users.findByIdAndUpdate({_id:req.params.id}, User, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('User successfully updated.');
            res.redirect('/');
        }
    });
});

module.exports = router;