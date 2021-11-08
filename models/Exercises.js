const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    nom: {
        type: String,
        required: true
    },

    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bodyPart: {
        type: String,
        required: true
    }


});

module.exports = mongoose.model('Exercises', UserSchema);