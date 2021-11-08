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
        required: true
    }


});

module.exports = mongoose.model('Users', UserSchema);