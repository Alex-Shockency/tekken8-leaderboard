const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: String
    },
    battle_at: {
        required: true,
        type: Number
    },
    battle_type: {
        required: true,
        type: Number
    },
    game_version: {
        required: true,
        type: Number
    },
    p1_area_id: {
        required: true,
        type: Number
    },
    p1_chara_id: {
        required: true,
        type: Number
    },
    p1_lang: {
        required: true,
        type: String
    },
    p1_name: {
        required: true,
        type: String
    },
    p1_polaris_id: {
        required: true,
        type: String
    },
    p1_power: {
        required: true,
        type: Number
    },
    p1_rank: {
        required: true,
        type: Number
    },
    p1_rating_before: {
        required: true,
        type: Number
    },
    p1_rating_change: {
        required: true,
        type: Number
    },
    p1_region_id: {
        required: true,
        type: Number
    },
    p1_rounds: {
        required: true,
        type: Number
    },
    p1_user_id: {
        required: true,
        type: Number
    },
    p2_area_id: {
        required: true,
        type: Number
    },
    p2_chara_id: {
        required: true,
        type: Number
    },
    p2_lang: {
        required: true,
        type: String
    },
    p2_name: {
        required: true,
        type: String
    },
    p2_polaris_id: {
        required: true,
        type: String
    },
    p2_power: {
        required: true,
        type: Number
    },
    p2_rank: {
        required: true,
        type: Number
    },
    p2_rating_before: {
        required: true,
        type: Number
    },
    p2_rating_change: {
        required: true,
        type: Number
    },
    p2_region_id: {
        required: true,
        type: Number
    },
    p2_rounds: {
        required: true,
        type: Number
    },
    p2_user_id: {
        required: true,
        type: Number
    },
    stage_id: {
        required: true,
        type: Number
    },
    winner: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Replay', dataSchema,'replays')