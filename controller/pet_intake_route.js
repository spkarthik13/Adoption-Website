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
        redirect('/');
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
    const { animalName, ageSelect, genderSelect, 
            animalSpecies, animalBreed, fertilitySelect, 
            weightSelect, animalBio} = req.body;
    const newPet = new Pet({
        name: animalName,
        age: ageSelect,
        gender: genderSelect,
        species: animalSpecies,
        breed: animalBreed,
        sterile: fertilitySelect,
        weight: weightSelect,
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