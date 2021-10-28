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
const userProfileRoute = require('./controller/user_profile_route');
const addBlogRoute = require('./controller/blogs_route');
const userRoute = require('./controller/user_route');
const petIntakeRoute = require('./controller/pet_intake_route');
const animalsRoute = require('./controller/animals_route');

app.use(homepageRoute, userProfileRoute, addBlogRoute, userRoute, petIntakeRoute, animalsRoute);

app.listen(process.env.PORT || 3000, () => (console.log(`Server listening on port ${process.env.PORT}.`)));

/* TODO:
Add form validation
Blog edit functionality
Filter features for animal viewing
Pagination on animal page


Question: Is there a better way to pass data in session then attaching it to every get route
*/