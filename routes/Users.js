const express = require('express');

const router = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require("../middlewares/auth")
const cookieparser = require("cookie-parser")
const _ = require('lodash')
const mailgun = require("mailgun-js");
const apikeyM= 'fde3713eedbac4ff270c145481ea1e0c-7dcc6512-007513dc'
const DOMAIN = 'sandbox727ad003dcf34021b8c00b4d70e73ade.mailgun.org';
const mg = mailgun({apiKey:apikeyM , domain: DOMAIN});
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { verifyEmail } = require('../middlewares/auth')






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



//mail sender details

  var transporter = nodemailer.createTransport({

    service : 'gmail',
    auth:{
      user: 'mohamediheb.aloui@esprit.tn',
      pass: '24533633aloui'
    },

    tls :{
      rejectUnauthorized : false
    }

  })




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
        emailToken: crypto.randomBytes(64).toString('hex'),
        isVerified: false
        
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

      var mailOptions = {
        from: '"RealityFit" <mohamediheb.aloui@esprit.tn>',
        to: user.email,
        subject: 'RealityFit - verify your email',
        html:  ` <h2> ${user.nom}! thanks for registering on our App </h2>
            <h4> please verify your mail to continue </h4>
            <a href="http://${req.headers.host}/users/verify-email?token=${user.emailToken}">Verify your email</a>
        `
      }

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error)
        }else {
          console.log('Verification mail is sent to your gmail')
        }
      })
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });


  router.get('/verify-email', async(req, res)=>{
    try {

      const token = req.query.token
      const user = await User.findOne({emailToken: token})
      console.log(token)
      if(user){
        user.emailToken = null
        user.isVerified = true
        await user.save()
      //  res.redirect('/login')
      }else{
        res.redirect('/register')
        console.log('email is not verified')
      }
      
    } catch (err) {
      console.log(err)
      
    }
  })



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

        const user = await User.updateOne({ _id: req.params.userID}, { $set: {
          nom: req.body.nom,
          prenom: req.body.prenom,
          email: req.body.email,
          password: req.body.password
        }});

        res.json(user);

    }catch (err){
        res.json({message:err});
    }

});


router.put("/forgotpassword", (req,res) => {

  const {email} = req.body; 

User.findOne({email}, (err, user) =>{

  if(err || !user){
      
      return res.status(400).json({error: "User with this email does not exists."});

  }
  const token = jwt.sign({_id: user._id}, 'AzerTy,5()', {expiresIn: '20m'});
  res.cookie("resettoken",token);


  const data = {

      from:'noreplay@hello.com',
      to: email,
      subject:'password Reset link',
      html:`  
      <h2>Please click on given link to reset your password</h2>
      <p>http://localhost:3000/resetpassword/${token}</p> 
      `
  };
  return user.updateOne({resetLink: token},function(err, success){
      if (err) {
          return res.status(400).json({error: "reset password link error"});
      }
      else
      {
mg.messages().send(data, function(error, body ){

  if(error) {
      return res.json({

          error:  error.message
      })
  }
      return res.json({message: 'email has been sent'});


});
      }
  })

})

});











router.put("/resetpassword", (req,res) => {

  const {newPass} = req.body;

  resetLink = req.cookies.resettoken;
  if (resetLink) {

      jwt.verify(resetLink, 'AzerTy,5()', function(error, decodedData) {
          
if(error) {
  console.log(error)
  return res.status(401).json({
      error: "Incorrect token or it is expired.",
      message:  error.message
 
  })
}
User.findOne({resetLink}, (err, user)=> {
if(err || !user)
{
  return res.status(400).json({error:"User with this token does not exist."});
}
bcrypt.hash(newPass, 10, function (err, hashedpass){

const obj ={

  password: hashedpass,
  resetLink:''
}

res.cookie('resettoken','');

user = _.extend(user, obj);
user.save((err,result)=>{
  if (err) {
      return res.status(400).json({error: "reset password  error"});
  }
  else
  {


  return res.status(200).json({message: 'Your password has been changed'});

  }

})
})

})
})
  }
   else{

  return res.status(401).json({error: "Authentication error!!!!"});
   }


});












module.exports = router;