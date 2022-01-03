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

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


 swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));





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

app.listen(3000 , () => console.log(`app listening on http://localhost:${port}`))