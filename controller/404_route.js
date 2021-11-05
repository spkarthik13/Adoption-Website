const express = require('express');
const router = express.Router();
const path = require('path');

router.get('*', (req, res) => {
    if (req.session.user) {
        res.render(path.resolve('./views/404'), {user: req.session.user});
    } else {
        res.render(path.resolve('./views/404'), {user: undefined});
    }
})

module.exports = router;