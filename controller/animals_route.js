// Imports.

const express = require('express');
const router = express.Router();
const path = require('path');
const Pet = require('../models/pet');
const fs = require('fs');

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
        res.redirect('/animals');
    }
}

router.get('/animals', checkUser, (req, res) => {
    const grabPets = Pet.find({inventoryApproved: true})
    .then(result => {
        res.render(path.resolve('./views/animals'), {user: req.session.user, approvedPet: result});
    })
    .catch(err => {
        console.log(`Error grabbing approved pets from the database ${err}`);
    })
    
});


router.get('/animals/admin_approval', checkAdmin, async (req, res) => {
    const grabPets = Pet.find({}).sort()
    .then(result => {
        const unapprovedPets = new Array;
        result.filter(pet => {
            if (pet.inventoryApproved === false) {
                unapprovedPets.unshift(pet);
            }
        })
        res.render(path.resolve('./views/animals_approval'), {user: req.session.user, unapprovedPet: unapprovedPets});
    })
    .catch(err => {
        console.log(`Error grabbing pets from database: ${err}`);
        res.redirect('/animals/admin_approval');
    })
    
})

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
    await Pet.findByIdAndUpdate(req.params.id, update);
    res.redirect('/animals/admin_approval');
});

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
    res.redirect('/animals');
});

// Apply to adopt animal.
router.get('/animals/apply_animal/:id', checkAdmin, async (req, res) => {
    let doUpdate = true;
    const grabPet = await Pet.findById({_id: req.params.id}).lean()
    .then((result) => {
        for (let i = 0; i < result.appliedMembers.length; i++) {
            if (result.appliedMembers[i]._id.equals(req.session.user._id)) {
                console.log(`This user has already applied to adopt this pet.`);
                doUpdate = false;
                i = result.appliedMembers.length;
        }}
    })
    .catch((error) => {
        console.log(`Error grabbing pet to check if user has already applied: ${error}`);
    })

    if (doUpdate) {
        const update = {$push: {'appliedMembers': req.session.user._id}};
        await Pet.findByIdAndUpdate(req.params.id, update)
        .then(() => {
            console.log('Successfully applied user to adopt this pet.');
        })
        .catch((error) => {
            console.log(`Error applying user for pet adoption: ${error}`);
        })
    }
    res.redirect('/animals');
});

// Remove adoption application.
router.get('/animals/remove_animal_application/:id', checkAdmin, async (req, res) => {
    const grabPet = await Pet.findById({_id: req.params.id})
    .then(async (result) => {
        await Pet.findByIdAndUpdate({_id: req.params.id}, {$pull: {'appliedMembers': req.session.user._id}})
    })
    .catch((error) => {
        console.log(`Error grabbing the pet in the database: ${error}`);
    })

    res.redirect('/animals');
})
module.exports = router;