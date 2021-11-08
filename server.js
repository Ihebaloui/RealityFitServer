const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require ('dotenv/config');

const app = express();

//MIDDLEWARES
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//IMPORT ROUTES

    //USER ROUTES
    const usersRoute = require('./routes/Users');
    app.use('/users', usersRoute);

    //EXERCISE ROUTE
    const exerciseRoute = require('./routes/Exercises');
    app.use('/exercises', exerciseRoute);


//ROUTES

app.get('/',(req, res) => {
    res.send('we are on home');
    }
);



//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, () => console.log('Connected to DB!'));

//LISTENING

app.listen(3000)