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

Fix hardcoded weight values.
Add search function to animal page
Admin approves adoption applications + "my animals" under regular user profile
Once adopted, move to a seperate pet collection

Model relationships (One too many relationships)



Things I learned that I would do different in the next project:
    1. Condense common object attributes into JSON objects in database instead of defining their own attribute individually.
    2. Be alot more strict on Schema set up, values stored with unconventional characters were a headache to use in filtering down the road.
    3. Make pagination (both on the EJS + back end) flexible to accept variables as conditions rather then hard code values.
    4. Look into setting a default for handing session info to routes rather then defining it in every render response.
*/