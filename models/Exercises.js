const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    nom: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    sets: {
        type: String,
        required: true
    },
    reps: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bodyPart: {
        type: String,
        required: true
    },

    isFavourite: {
        type: Boolean,
        required: false,
    }


});

module.exports = mongoose.model('Exercises', UserSchema);