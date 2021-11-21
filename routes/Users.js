const express = require('express');

const router = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require("../middlewares/auth")








//TOKEN AUTHENTICATION

router.post("/auth", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });

//DISPLAY ALL

router.get('/display', async (req, res) => {

    try{
        const users = await User.find();
        res.json(users);

    }catch(err){
        res.json({message:err})
    }
    
});

//DISPLAY BY ID

router.get('/:userID', async (req, res) => {

    try{
        const users = await User.findById(req.params.userID);
        res.json(users);

    }catch(err){
        res.json({message:err})
    }
    
});

//ADD USERS

router.post('/add', async (req,res) => {

    
    const hashedPassword = await bcrypt.hash(req.body.password, 10 )
    const user = new User ({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: hashedPassword,
        gender: req.body.gender,
        age: req.body.age,
        weight: req.body.weight,
        height: req.body.height,
        experience: req.body.experience,
        goal: req.body.goal
    
    });
    user.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({ message: err});
    });
});

//REGISTER

router.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { prenom, nom, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && prenom && nom)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        prenom,
        nom,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });





//LOGIN
router.post('/login', async (req,res) => {
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }


});




//DELETE USER
router.delete('/:userID', async (req, res) => {
    try{

        const user = await User.remove({ _id: req.params.userID});
        res.json(user);

    }catch (err){
        res.json({message:err});
    }

});

//UPDATE

router.patch('/:userID', async (req, res) => {
    try{

        const user = await User.updateOne({ _id: req.params.userID}, { $set: {nom: req.body.nom}});

        res.json(user);

    }catch (err){
        res.json({message:err});
    }

});







module.exports = router;