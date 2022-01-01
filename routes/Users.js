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
const multer = require('multer')
const path = require('path')







const storage = multer.diskStorage({
  destination(req,file, cb){
      cb(null,'uploads/')
  },
  filename(req,file,cb){
      cb(null,`${file.fildname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})
const fileFilter = (req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype ===  'image/jpg'){
          cb(null,true);
    }else{
          cb(null,false);
    }
}
const upload = multer({storage: storage,fileFilter: fileFilter
  })



//TOKEN AUTHENTICATION

router.post("/auth", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });

//DISPLAY ALL

router.get('/display', async (req, res) => {

    try{
        const users = await User.find();
        res.status(200).json(users);

    }catch(err){
        res.status(400).json({message:err})
    }
    
});




 /**
  * @swagger
 * /users/display:
 *   description: The utilisateurs managing API
 *   get:
 *     summary: Returns the list of all the utilisateurs
 *     tags: [Users]
*     responses:
 *       200:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */


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

router.post("/register",upload.single('image'), async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { prenom, nom, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && prenom && nom )) {
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
        verifCode: Math.floor(100000 + Math.random() * 900000),
        isVerified: false,
        image: req.file.path

        
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, nom, prenom },
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
        html:  ` <h2> hi ${user.nom}! thanks for registering on our App , this is your verification code</h2>
            <h4> ${user.verifCode } </h4>

           
        `
        //<a href="http://${req.headers.host}/users/verify-email?token=${user.emailToken}">Verify your email</a>
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


/**
  * @swagger
 * /users/register/:
 *   description: user Registration
 *   post:
 *     summary: Returns a message of success
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: nom
 *         type: string
 *       - in: body
 *         name: prenom
 *         type: string
 *       - in: body
 *         name: email
 *         type: string
 *       - in: body
 *         name: password
 *         type: string
*     responses:
 *       200:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */






  router.patch('/verify-email/:userID', async(req, res)=>{

    try {
     const user = await  User.findById(req.params.userID);
      const verifCode = req.body.verifCode
      console.log(req.body.verifCode)
      console.log(user.verifCode)
      
      if(user.verifCode == verifCode){
        user.verifCode = null
        user.isVerified = true
        await user.save()
        .then(data => {
          res.status(201).json(data);
         
      })
      //  res.redirect('/login')
      }else{
        
        res.status(400).send("All input is required");
        

       // res.redirect('/register')
        console.log('email is not verified')
      }
      
    } catch (err) {
      console.log(err)
      
    }
  })

  /**
  * @swagger
 * /users/register/:
 *   description: user Registration
 *   post:
 *     summary: Returns a message of success
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: nom
 *         type: string
 *       - in: body
 *         name: prenom
 *         type: string
 *       - in: body
 *         name: email
 *         type: string
 *       - in: body
 *         name: password
 *         type: string
*     responses:
 *       200:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */


  



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
        if (user && (await bcrypt.compare(password, user.password)) && user.isVerified == true) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email, nom: user.nom, prenom: user.prenom, image: user.image},
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
        res.status(400).send("Invalid Credentials or you need to check your email for verification");
      } catch (err) {
        console.log(err);
      }


});


/**
  * @swagger
 * /users/login/:
 *   description: user Login
 *   post:
 *     summary: Returns a message of success
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: email
 *         type: string
 *       - in: body
 *         name: password
 *         type: string
*     responses:
 *       200:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */





//DELETE USER
router.delete('/delete', async (req, res) => {
    try{
 User.remove(this.all)
      //  const user = await User.remove({ _id: req.params.userID});
        res.json(user);

    }catch (err){
        res.json({message:err});
    }

});

//UPDATE

router.patch('/:userID', async (req, res) => {
  encryptedPassword = await bcrypt.hash(req.body.password, 10);

  print(req.body.password)
    try{

        const user = await User.updateOne({ _id: req.params.userID}, { $set: {
          nom: req.body.nom,
          prenom: req.body.prenom,
          email: req.body.email,
          password: encryptedPassword
        }});
        print(req.body.password)
        res.status(201).json(user);
        

    }catch (err){
        res.json({message:err});
    }

});



/**
  * @swagger
 * /users/{userID}/:
 *   description: user Registration
 *   patch:
 *     summary: Returns a message of success
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userID
 *         type: string
 *       - in: body
 *         name: nom
 *         type: string
 *       - in: body
 *         name: prenom
 *         type: string
 *       - in: body
 *         name: email
 *         type: string
 *       - in: body
 *         name: password
 *         type: string
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */



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