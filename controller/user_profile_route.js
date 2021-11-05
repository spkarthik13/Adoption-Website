const path = require('path');
const express = require('express');
const router = express.Router();
const Users = require('../models/user');
const AdoptedPet = require('../models/adopted_pet');
const bcrypt = require('bcrypt');

checkUser = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('*');
    }
};

router.get('/userProfile/:id', checkUser, async (req, res) => {
    const grabUser = await Users.findById({_id: req.params.id})
    if (grabUser.adoptedPets.length > 0) {
        const grabPets = await AdoptedPet.find({'_id': { $in: result.adoptedPets}})
        .then(() => {
            res.render(path.resolve('./views/user_profile.ejs'), {adoptedPet: grabPets, user: req.session.user, userInfo: grabUser});
        })
    } else {
        res.render(path.resolve('./views/user_profile.ejs'), {adoptedPet: [], user: req.session.user, userInfo: grabUser});
    }
});

// Update route.
router.post('/userProfile/edit/:id', checkUser, async (req, res) => {
    if (req.body.currentPw && req.body.newPw) {
        const user = await Users.findById({_id: req.params.id})
        if (await bcrypt.compare(req.body.currentPw, user.hashedPass)) {
            try {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(req.body.newPw, salt);
                if (req.body.phNumber) {
                    update = {
                        phoneNumber: req.body.phNumber,
                        hashedPass: hashedPassword,
                    };
                } else {
                    update = {
                        hashedPass: hashedPassword,
                    };
                }
                await Users.findByIdAndUpdate({_id:req.params.id}, update)
            } catch {
                console.log('Error creating hashed password.');
            }
        } else {
            console.log('Wrong password.');
        }
    } else {
        update = {
            phoneNumber: req.body.phNumber,
        };
        await Users.findByIdAndUpdate({_id:req.params.id}, update)
        .then((result) => {
            res.redirect('/');
        })
        .catch((error) => {
            console.log(`Error updating user: ${error}`);
        })
    }

    res.redirect('/userProfile/' + req.params.id);
});
module.exports = router;