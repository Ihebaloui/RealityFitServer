const mongoose = require('mongoose');

const PlanSchema = mongoose.Schema({

    nom: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    exercises_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercises'
    }]


});

module.exports = mongoose.model('Plans', PlanSchema);