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

    difficulty: {
        type: String,
        required: true
    },
    day1: {
        type: String,
        required: true
    },

    day2: {
        type: String,
        required: true
    },
    day3: {
        type: String,
        required: true
    },
    day4: {
        type: String,
        required: true
    },
    day5: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    isBought: {
        type: Boolean,

    }


});

module.exports = mongoose.model('Plans', PlanSchema);