// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/user');
const AdoptedPet = require('../models/adopted_pet');

checkUser = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.render(path.resolve('./views/error_page'), {error: 'authError'});
    }
};

router.get('/userProfile/:id', checkUser, async (req, res) => {
    const grabUser = await Users.findById({_id: req.params.id})
    .then((result) => {
        let filteredResult = AdoptedPet.find({'_id': { $in: result.adoptedPets}})
        .then((result) => {
            console.log(result);
            res.render(path.resolve('./views/user_profile.ejs'), {adoptedPet: result, user: req.session.user});
        })
    })
    .catch(err => {
        console.log(`Error grabbing user profile on the update page: ${err}`);
    });
});

// Update route.
router.post('/userProfile/edit/:id', checkUser, async (req, res) => {
    let User = {
        phoneNumber: req.body.phNumber,
        age: req.body.age,
        address: req.body.address,
        city: req.body.city,
        squareFt: req.body.sqFeet,
        children: req.body.childrenInput,
        outdoorArea: req.body.outdoorArea,
        fencedArea: req.body.fencedArea,
    };

    await Users.findByIdAndUpdate({_id:req.params.id}, User)
    .then((result) => {
        res.redirect('/');
    })
    .catch((error) => {
        console.log(`Error updating user: ${error}`);
    })
});
module.exports = router;