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
const loginRoute = require('./controller/login_route');
const petIntakeRoute = require('./controller/pet_intake_route');

app.use(homepageRoute, userProfileRoute, addBlogRoute, loginRoute, petIntakeRoute);

app.listen(process.env.PORT || 3000, () => (console.log(`Server listening on port ${process.env.PORT}.`)));

/* TODO:
User Session Information doesn't reflect on front page despite being updated before redirection.
Add form validation
Take sensitive data out of session
Pass data from blog edit button to blog edit modal
Add pagination to blog page

Question: Is there a better way to pass data in session then attaching it to every get route
*/