const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require ('dotenv/config');
const session = require("express-session");
const passport = require('passport')
const cookieparser = require('cookie-parser')
const app = express();






//MIDDLEWARES
//app.use(passport.session());
//app.use(passport.initialize());

//app.use(session({secret: "thisissecretkey"}));


app.use(cookieparser());



app.use(express.urlencoded({extended: true}));
app.use(express.json());



//IMPORT ROUTES

    //USER ROUTES
    const usersRoute = require('./routes/Users');
    app.use('/users', usersRoute);

    //EXERCISE ROUTE
    const exerciseRoute = require('./routes/Exercises');
    app.use('/exercises', exerciseRoute);
    
    //FACEBOOK_API_ROUTE
    const facebookAPIROUTE = require('./routes/FacebookApi');
    app.use('/fbapi',facebookAPIROUTE);
    //PLAN ROUTE

    const planRoute = require('./routes/Plans');
    app.use('/plan', planRoute);



    //WELCOME ROUTE
   


//ROUTES

app.get('/',(req, res) => {
    res.send('we are on home');
    }
);


app.use('/uploads',express.static('uploads'))

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, () => console.log('Connected to DB!'));

//LISTENING

app.listen(3000)