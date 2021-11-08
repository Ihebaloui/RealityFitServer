const express = require('express');

const router = express.Router();
const User = require('../models/Users')

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

router.post('/add', (req,res) => {
    const user = new User ({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender
    
    });
    user.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({ message: err});
    });
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