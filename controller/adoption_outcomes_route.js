// Imports.
const path = require('path');
const express = require('express');
const router = express.Router();
const Pet = require('models/pet');

let checkAdmin = function(req, res, next) {
    if (!req.session.user.isAdmin) {
        res.redirect('/');
    } else {
        next();
    };
};

router.get('/adoption_outcomes', checkAdmin, async (req, res) => {
    const PetsArray = await Pet.find({inventoryApproved: false});
    res.render(path.resolve('./views/adoption_outcomes.ejs'), {pets: PetsArray});
});

module.exports = router;