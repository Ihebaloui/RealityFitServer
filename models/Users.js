const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    nom: {
        type: String,
        required: true
    },

    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },

    age: {
        type: Number,
        required: false
    },
    weight: {
        type: String,
        required: false,
    },

    height: {
        type: String,
        required: false
    },

    experience: {
        type: String,
        required: false
    },

    goal: {
        type: String,
        required: false
    },

    token: {
        type: String
    },
    resetLink:{
        data:String,
        default:''
    },
    verifCode: {
        type: String,
    },
    isVerified: {
        type: Boolean,
    }



    


});

module.exports = mongoose.model('Users', UserSchema);