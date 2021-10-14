// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/registration');

checkUser = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.render(path.resolve('./views/error_page'), {error: 'authError'});
    }
}

router.get('/userProfile/:id', checkUser, (req, res) => {
    console.log(req.session.user);
    res.render(path.resolve('./views/userProfile.ejs'), {user: req.session.user});
});

// Update route.
router.post('/userProfile/edit/:id', checkUser, (req, res) => {
    let User = {
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        address: req.body.address,
        gender: req.body.gender,
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