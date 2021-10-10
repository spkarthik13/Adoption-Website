require('dotenv').config(); // Import .env to handle environment variables.
const database = require('./database'); // Connect to the database.

// Required imports.
const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);
const Sessions = require('./sessions');
app.use(Sessions);

// Set view engine to parse ejs.
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}), express.json());


// TODO: Look into better way to consolidate route imports instead of just repeating?
const homepageRoute = require('./controller/homepage_route');
const loginErrorRoute = require('./controller/loginError_route');
const userProfileRoute = require('./controller/userProfile_route');
const addBlogRoute = require('./controller/addBlogPost_route');

app.use(homepageRoute, loginErrorRoute, userProfileRoute, addBlogRoute);

app.listen(process.env.PORT || 3000, () => (console.log(`Server listening on port ${process.env.PORT}.`)));

/* TODO: Add a base CSS style that all pages inherit from.
    Add verification middleware to admin panel + associated pages.
    Add error page when user tries to navigate to protected route.
    Add ability to add multiple files to blog posts.
    Add file name generation to multer within addBlogPostRoute
    Add password encryption
    Add admin ability to delete blog post
*/