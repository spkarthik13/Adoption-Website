// Required imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');
const multer = require('multer');
const nanoid = require('nanoid');

isMember = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}
router.get('/pet_intake', isMember, (req, res) => {
    res.render(path.resolve('./views/pet_intake.ejs'));
});

// Define storage for multer.
const storage = multer.diskStorage({
    // Destination for files.
    destination: function(req, file, callback) {
        callback(null, './public/uploads/pet_intake/');
    },
    filename: function(req, file, callback) {
        callback(null, nanoid.nanoid() + path.extname(file.originalname));
    },
});

// Upload parameters for multer.
const upload = multer({
    storage:storage,
});

router.post('/pet_intake', isMember, upload.array('formFileMultiple'), (req, res) => {
    const { animalName, animalAge, animalGender, 
            animalSpecies, animalBreed, animalReproduction, 
            animalWeight, animalBio } = req.body;
    const newPet = new Pet({
        name: animalName,
        age: animalAge,
        gender: animalGender,
        species: animalSpecies,
        breed: animalBreed,
        sterile: animalReproduction,
        weight: animalWeight,
        intakeMember: req.session.user._id,
        otherInfo: animalBio,
        pictures: req.files,
    });

    newPet.save()
        .then(result => {
            console.log(`New animal successfully saved: ${result}`);
        })
        .catch(error => {
            console.log(`Error saving blog to the database ${error}`);
        })
    
    res.redirect('/');
})

module.exports = router;