// Imports.

const express = require('express');
const router = express.Router();
const path = require('path');
const Pet = require('../models/pet');

function checkUser(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/animals', checkUser, (req, res) => {
    const grabPets = Pet.find({}).sort()
    .then(result => {
        const approvedPets = new Array;
        const unapprovedPets = new Array;
        result.filter(pet => {
            if (pet.inventoryApproved === false) {
                unapprovedPets.unshift(pet);
            } else {
                approvedPets.unshift(pet);
            }
        })
        res.render(path.resolve('./views/animals'), {user: req.session.user, approvedPet: approvedPets, unapprovedPet: unapprovedPets});
        })
    .catch(err => {
        console.log(`Error grabbing pets from database: ${err}`);
    })
});

module.exports = router;