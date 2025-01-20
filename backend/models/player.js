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
    is_approved: {
        required: true,
        type: Boolean
    },
    max_chara: {
        required: true,
        type: Object
    },
    max_qual_chara: {
        required: true,
        type: Object
    },
    region_id: {
        required: true,
        type: Number
    },
    state_id: {
        required: true,
        type: String
    },
})

module.exports = mongoose.model('Player', dataSchema,'players')