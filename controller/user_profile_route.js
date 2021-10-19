// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/user');

checkUser = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.render(path.resolve('./views/error_page'), {error: 'authError'});
    }
};

router.get('/userProfile/:id', checkUser, (req, res) => {
    res.render(path.resolve('./views/user_profile.ejs'), {user: req.session.user});
});

// Update route.
router.post('/userProfile/edit/:id', checkUser, (req, res) => {
    console.log(req.params.id);
    let User = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phNumber,
        age: req.body.age,
        address: req.body.address,
        city: req.body.city,
        squareFt: req.body.sqFeet,
        children: req.body.childrenInput,
        outdoorArea: req.body.outdoorArea,
        fencedArea: req.body.fencedArea,
    };

    Users.findByIdAndUpdate({_id:req.params.id}, User, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log('User successfully updated.');
            res.redirect('/');
        }
    });
});
module.exports = router;