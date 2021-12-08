const express = require('express');
const Exercises = require('../models/Exercises');
const Exercise = require('../models/Exercises');
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
        }else{
              cb(null,false);
        }
  }
  const upload = multer({storage: storage,fileFilter: fileFilter
      })


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

//ADD EXERCISE

router.post('/add',upload.single('image'), (req,res) => {
    const exercise = new Exercise ({
        nom: req.body.nom,
        sets: req.body.sets,
        reps: req.body.reps,
        duration: req.body.duration,
        description: req.body.description,
        bodyPart: req.body.bodyPart,
        image: req.file.path
    
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






module.exports = router;