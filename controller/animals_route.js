const express = require('express');
const router = express.Router();
const path = require('path');
const Pet = require('../models/pet');
const fs = require('fs');
const pageination = require('../pagination');
const User = require('../models/user')
const mongoose = require('mongoose');

function checkUser(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.redirect('/animals?page=1&limit=3');
    }
}

router.get('/animals', checkUser, pageination.pagination(Pet, true), async (req, res) => {
    const approvedPet = res.paginatedResults;
    res.render(path.resolve('./views/animals'), {user: req.session.user, approvedPet: approvedPet,  currentURL: req.url});
})

// router.get('/animals', checkUser, pageination.pagination(Pet, true), (req, res) => {
//     // const approvedPet = res.paginatedResults;
//     // console.log(approvedPet);
//     // res.render(path.resolve('./views/animals'), {user: req.session.user, approvedPet: approvedPet,  currentURL: req.url});
// })

// Admin view to approve of incoming animals.
router.get('/animals/admin_approval', checkAdmin, async (req, res) => {
    const grabPets = await Pet.find({'inventoryApproved': false}).sort({createdAt: -1})
    .then(result => {
        res.render(path.resolve('./views/animals_approval'), {user: req.session.user, unapprovedPet: result})
    })
    .catch(error => {
        console.log(`Error fetching unapproved pets from database, error: ${error}`);
    })    
})

// Admin route to post approved animal.
router.post('/animals/approve_animal/:id', checkAdmin, async (req, res) => {
    const {sqFtSelect, outdoorBool, childBool, fencedBool} = req.body;
    const update = {
        inventoryApproved: true,
        adminSuggestion: {
            sqFeet: sqFtSelect,
            outdoor: outdoorBool,
            children: childBool,
            fenced: fencedBool,
        }
    }
    await Pet.updateOne({_id: req.params.id}, update);
    res.redirect('/animals/admin_approval');
});

// Delete incoming animal application.
router.get('/animals/delete_animal/:id', checkAdmin, async (req, res) => {
    const deleteAnimal = await Pet.findByIdAndDelete({_id: req.params.id})
    .then(result => {
        for (let i = 0; i < result.pictures.length; i++) {
            fs.unlink(path.resolve('./public/uploads/pet_intake/' + result.pictures[i].filename), (err => {
                if (err) { 
                    console.log(`Error deleting animal file directory: ${err}`);
                } else {
                    console.log(`Successfully deleted file related to animal: ${result.pictures[i].filename}`);
                }})
            )
        }})
    .catch(err => {
        if (err) {
            console.log(`Error fetching blog from database: ${err}`);
        }})
    res.redirect('/animals/admin_approval');
});

// Apply to adopt animal.
router.get('/animals/apply_animal/:id', checkUser, async (req, res) => {
    // By default the user will be applied.
    let doUpdate = true;

    // Find the pet in database.
    const grabPet = await Pet.findById({_id: req.params.id})
    .then((result) => {
        // If the user has already applied to adopt this animal, stop the update.
        for (let i = 0; i < result.appliedMembers.length; i++) {
            if (result.appliedMembers[i].equals(req.session.user._id)) {
                console.log(`This user has already applied to adopt this pet.`);
                doUpdate = false;
                i = result.appliedMembers.length;
        }}
    })
    .catch((error) => {
        console.log(`Error grabbing pet to check if user has already applied: ${error}`);
    })

    if (doUpdate) {
        // Pet gets user added to applied members.
        await Pet.findByIdAndUpdate(req.params.id, {$push: {'appliedMembers': req.session.user._id}})
    }

    // Redirect back to pet page.
    res.redirect('/animals?page=1&limit=3');
});

// Remove adoption application.
router.get('/animals/remove_animal_application/:id', checkAdmin, async (req, res) => {
    // Find the pet, then apply the update.
    await Pet.findByIdAndUpdate({_id: req.params.id}, {$pull: {'appliedMembers': req.session.user._id}})
    res.redirect('/animals?page=1&limit=3');
})
module.exports = router;