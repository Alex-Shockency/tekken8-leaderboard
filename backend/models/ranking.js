const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id:{
        required: true,
        type: Object
    },
    name: {
        required: true,
        type: String
    },
    rank: {
        required: true,
        type: Number
    },
    rating: {
        required: true,
        type: Number
    },
    power: {
        required: true,
        type: Number
    },
    date: {
        required: true,
        type: Date
    },
})

module.exports = mongoose.model('Ranking', dataSchema,'players')