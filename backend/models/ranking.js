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
    characters: {
        required: true,
        type: Array
    },
})

module.exports = mongoose.model('Ranking', dataSchema,'players')