const express = require('express');
const Exercises = require('../models/Exercises');
const Exercise = require('../models/Exercises');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const auth = require('../middlewares/auth');
const plans = require('../models/plans');


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



      router.get('/displayPlan', async (req, res) => {

        try{
            const Plans = await Exercise.find().select('nom bodyPart image -_id');
            res.json(Plans);
    
        }catch(err){
            res.json({message:err})
        }
        
    });




    router.get('/comments/:exerciseID', async (req, res) => {

        try{
            const exercises = await Exercise.findById(req.params.exerciseID).select('comments');
            res.status(201).json(exercises);
    
        }catch(err){
            res.json({message:err})
        }
        
    });


    /**
  * @swagger
 * /exercises/comments/{exerciseID}/:
 *   description: get exercise comments
 *   get:
 *     parameters:
 *       - in: path
 *         name: exerciseID
 *         type: string
 *     summary:  get exercise comments
 *     tags: [excercises]
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */



 router.post('/deletecomments/:exerciseID', async (req, res) => {

        try{
            const exercises = await Exercise.findById(req.params.exerciseID).select('comments')
     
            res.json(exercises);
    
        }catch(err){
            res.json({message:err})
        }
        
    });
//DISPLAY ALL

router.get('/display', async (req, res) => {

    try{
        const exercises = await Exercise.find();
        res.json(exercises);

    }catch(err){
        res.json({message:err})
    }
    
});

//DISPLAY BY ID

router.get('/:exerciseID', async (req, res) => {

    try{
        const exercises = await Exercises.findById(req.params.exerciseID);
        res.json(exercises);

    }catch(err){
        res.json({message:err})
    }
    
});


  /**
  * @swagger
 * /exercises/{exerciseID}/:
 *   description: Specific excercise Displays
 *   get:
 *     summary: Returns a list of not Bought plans
 *     tags: [excercises]
 *     parameters:
 *       - in: path
 *         name: exerciseID
 *         type: string
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */

 /**
  * @swagger
 * /exercises/display/:
 *   description: Specific excercise Displays
 *   get:
 *     summary: Returns a list of not Bought plans
 *     tags: [excercises]
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */




router.patch('/markasfavourite/:exerciseID', async (req, res) => {
    try{

        const exercise = await Exercises.findById(req.params.exerciseID)
        exercise.isFavourite = true
           


        await exercise.save()
        .then(data => {
          res.status(201).json(data);
         
      })

    }catch (err){
        res.json({message:err});
    }

});
router.patch('/unmarkasfavourite/:exerciseID', async (req, res) => {
    try{

        const exercise = await Exercises.findById(req.params.exerciseID)
        exercise.isFavourite = false
           

        
        await exercise.save()
        .then(data => {
          res.status(201).json(data);
         
      })

    }catch (err){
        res.json({message:err});
    }

});

/**
  * @swagger
 * /markasfavourite/{exerciseID}/:
 *   description: Specific excercise Displays
 *   patch:
 *     summary: mark an exercise as a favourite
 *     tags: [excercises]
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */

/**
  * @swagger
 * /unmarkasfavourite/{exerciseID}/:
 *   description: Specific excercise Displays
 *   patch:
 *     summary: mark an exercise as a favourite
 *     tags: [excercises]
*     responses:
 *       201:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */





/**
  * @swagger
 * /exercises/add/:
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
 *         name: sets
 *         type: string
 *       - in: body
 *         name: reps
 *         type: string
 *       - in: body
 *         name: duration
 *         type: string
 *       - in: body
 *         name: description
 *         type: string
 *       - in: body
 *         name: bodyPart
 *         type: string
*     responses:
 *       200:
 *         description: The list utilisateurs
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */




//ADD EXERCISE

router.post('/add',upload.single('image'), (req,res) => {
    const exercise = new Exercise ({
        nom: req.body.nom,
        sets: req.body.sets,
        reps: req.body.reps,
        duration: req.body.duration,
        description: req.body.description,
        bodyPart: req.body.bodyPart,
        image: req.file.path,
        isFavourite: false
    
    });
    exercise.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({ message: err});
    });
});

//DELETE EXERCISE
router.delete('/:exerciseID', async (req, res) => {
    try{

        const exercise = await Exercises.remove({ _id: req.params.exerciseID});
        res.json(exercise);

    }catch (err){   
        res.json({message:err});
    }

});


//UPDATE

router.patch('/:exerciseID', async (req, res) => {
    try{

        const exercise = await Exercises.updateOne({ _id: req.params.exerciseID}, { $set: {nom: req.body.nom}});

        res.json(exercise);

    }catch (err){
        res.json({message:err});
    }

});

//Comments
router.put('/comment',auth,async (req,res)=>{
    try{
    const comment = {
        text:req.body.text,
        postedBy:req.user.prenom +" "+ req.user.nom,
        image: req.user.image
    }
   await Exercise.findByIdAndUpdate(req.body.exerciseID,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id prenom")
    res.status(201).json(comment)

}catch(err){
    res.json({message:err});
}
  
})


router.delete('/delete', async (req, res) => {
    try{
 Plans.remove(this.all)
      //  const user = await User.remove({ _id: req.params.userID});
        res.json(plans);

    }catch (err){
        res.json({message:err});
    }

});



module.exports = router;