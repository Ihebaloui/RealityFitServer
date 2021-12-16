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


router.get('/display', async (req, res) => {

    try{
        const plan = await Plan.find();
        res.json(plan);

    }catch(err){
        res.json({message:err})
    }
    
});

//DISPLAY BY ID

router.get('/:PlanId', async (req, res) => {

    try{
        const plan = await Plan.findById(req.params.PlanId).populate('exercises_id','bodyPart');
        res.json(plan);

    }catch(err){
        res.json({message:err})
    }
    
});

//ADD PLAN

router.post('/add',upload.single('image'), (req,res) => {
    const plan = new Plan ({
        nom: req.body.nom,
        exercises_id: req.body.exercises_id,
        image: req.file.path
    
    });
    plan.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({ message: err});
    });
});

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

router.patch('/:PlanId', async (req, res) => {
    try{

        const plan = await Plan.updateOne({ _id: req.params.PlanId}, { $set: {nom: req.body.nom}});

        res.json(plan);

    }catch (err){
        res.json({message:err});
    }

});






module.exports = router;