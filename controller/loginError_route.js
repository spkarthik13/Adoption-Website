// Required imports.
const path = require('path');
const express = require('express');
const router = express.Router();

// Could add a specific fail message here, ex. if a user fails on credentials, wrong password and correct email, vice versa, no user in DB under email.
router.get('/loginError', (req, res) => {
    res.render(path.resolve('./views/loginError.ejs'));
});

module.exports = router;