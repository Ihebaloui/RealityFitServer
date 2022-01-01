const express = require('express');
const Exercises = require('../models/Exercises');
const Plan = require('../models/plans');
const router = express.Router();
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
        }else
        {
              cb(null,false);
        }
  }
  const upload = multer({storage: storage,fileFilter: fileFilter
      })


//DISPLAY ALL
router.get('/displayplan', async (req, res) => {

    try{
        const Plans = await Exercise.find().select('nom bodyPart image -_id');
        res.json(Plans);

    }catch(err){
        res.json({message:err})
    }
    
});
/**
  * @swagger
 * /plan/display/:
 *   description: Plans Displays
 *   get:
 *     summary: Returns a list of plans
 *     tags: [plans]
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */



router.get('/display', async (req, res) => {

    try{
        const plan = await Plan.find();
        res.json(plan);

    }catch(err){
        res.json({message:err})
    }
    
});


router.get('/displayBought', async (req, res) => {

    try{
        const plan = await Plan.find({isBought :true});
        res.json(plan);

    }catch(err){
        res.json({message:err})
    }
    
});

/**
  * @swagger
 * /plan/displayBought/:
 *   description: Plans Displays
 *   get:
 *     summary: Returns a list of bought plans
 *     tags: [plans]
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */


router.get('/displayNotBought', async (req, res) => {

    try{
        const plan = await Plan.find({isBought :false});
        res.json(plan);

    }catch(err){
        res.json({message:err})
    }
    
});
/**
  * @swagger
 * /plan/displayNotBought/:
 *   description: Plans Displays
 *   get:
 *     summary: Returns a list of not Bought plans
 *     tags: [plans]
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */


//DISPLAY BY ID

router.get('/:PlanId', async (req, res) => {

    try{
        const plan = await Plan.findById(req.params.PlanId);
        res.status(201).json(plan);

    }catch(err){
        res.json({message:err})
    }
    
});


/**
  * @swagger
 * /plan/{planID}/:
 *   description: Plans Displays
 *   get:
 *     summary: Returns a list of not Bought plans
 *     tags: [plans]
 *     parameters:
 *       - in: path
 *         name: planID
 *         type: string
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */

//ADD PLAN

router.post('/add',upload.single('image'), (req,res) => {
    const plan = new Plan ({
        nom: req.body.nom,
        image: req.file.path,
        difficulty: req.body.difficulty,
        day1: req.body.day1,
        day2: req.body.day2,
        day3: req.body.day3,
        day4: req.body.day4,
        day5: req.body.day5,
        price: req.body.price,
        isBought: false

    
    });
    plan.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({ message: err});
    });
});



/**
  * @swagger
 * /plan/add/:
 *   description: ADD A PLAN
 *   post:
 *     summary: Returns a message of success
 *     consumes:
 *       - multipart/form-data
 *     tags: [plans]
 *     parameters:
 *       - in: body
 *         name: nom
 *         type: string
 *       - in: body
 *         name: difficulty
 *         type: string
 *       - in: body
 *         name: day1
 *         type: string
 *       - in: body
 *         name: day2
 *         type: string
 *       - in: body
 *         name: day3
 *         type: string
 *       - in: body
 *         name: day4
 *         type: string
 *       - in: body
 *         name: day5
 *         type: string
 *       - in: body
 *         name: price
 *         type: string
 *       - in: formData
 *         name: image
 *         type: file
*     responses:
 *       200:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */




router.put('/addExercises/:id',upload.single('image'),async(req,res)=>{
    const plan = await Plan.findById(req.params.id)

    if(plan){
        plan.nom = plan.nom,
        plan.image = plan.image,
        plan.exercises_id.push(req.body.exercises_id)
      

        const updatePlan = await plan.save()

        res.status(201).json({ updatePlan })
       

        
    } else{
        res.json({message:err});
    }})
//DELETE PLAN
router.delete('/:PlanId', async (req, res) => {
    try{

        const plan = await Plan.remove({ _id: req.params.PlanId});
        res.json(plan);

    }catch (err){   
        res.json({message:err});
    }

});


//UPDATE

router.patch('/:planID', async (req, res) => {
   
  
      try{
  
          const plan = await Plan.findById({ _id: req.params.planID}) 
          plan.isBought = true
       
  
          await plan.save()
          .then(data => {
            res.status(201).json(data);
           
        })
          
  
      }catch (err){
          res.json({message:err});
      }
  
  });






module.exports = router;