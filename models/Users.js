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
    gender: {
        type: String,
        required: false
    },

    age: {
        type: Number,
        required: false
    },
    weight: {
        type: Number,
        required: false,
    },

    height: {
        type: Number,
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
    }


});

module.exports = mongoose.model('Users', UserSchema);