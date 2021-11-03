// Imports.
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Pet = require('../models/pet');
const AdoptedPet = require('../models/adopted_pet');
const date = new Date();

function checkAdmin(req, res, next) {
    if (req.session.user.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/animals/adoption_approval', checkAdmin, async (req, res) => {
    const appliedPets = await Pet.find({'appliedMembers': { $exists: true, $not: {$size: 0}}})
    let applicantArray = new Array;

    for (let pet of appliedPets) {
        const grabApplicants = await User.find({'_id': { $in: pet.appliedMembers}})
        const filtered = grabApplicants.map((i) => i.fullName)
        applicantArray.push(filtered);
    }
    res.render('../views/adoption_approval.ejs', {user: req.session.user, pet: appliedPets, applicants: applicantArray})
})

router.post('/animals/adoption_approval/:id', checkAdmin, async (req, res) => {
    const grabPet = await Pet.findOne({_id: req.params.id})
    .then(doc => {
        AdoptedPet.insertMany(doc)
        .then(d => {
            console.log('Pet successfully copied to adopted collection');
        })
        .catch(error => {
            console.log(`Error copying pet the adopted collection: ${error}`);
        })

        Pet.deleteOne({_id: req.params.id})
        .then(d => {
            console.log('Pet successfully removed from the pet collection.');
        })
        .catch(error => {
            console.log(`Error removing pet from the pet collection: ${error}`);
        })
        .catch(error => {
            console.log(error);
        })

        User.findOneAndUpdate({_id: req.session.user._id}, {$push: {'adoptedPets': req.params.id}})
        .then((result) => {
                console.log(result);
                res.redirect('/animals/adoption_approval');
            })
        .catch((err) => {
                console.log(`Error saving to user's adopted animals: ${error}`);
            })
    })
        
})

module.exports = router;