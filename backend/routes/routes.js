const express = require('express');

const router = express.Router()
const Replay = require('../models/replay');
const Ranking = require('../models/ranking');

module.exports = router;

router.get('/rankings', async (req, res) => {
    try{
        const data = await Ranking.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/rankings/:tekkenId', async (req, res) => {
    try{
        const data = await Ranking.find({"_id.tekkenId":req.params.tekkenId});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get all Method
router.get('/replays', async (req, res) => {
    try{
        const data = await Replay.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by TekkenID Method
router.get('/replays/:tekkenId', async (req, res) => {
    try{
        const data = await Replay.find({ $or : [ { "p1_polaris_id" : req.params.tekkenId }, { "p2_polaris_id" : req.params.tekkenId } ] }).sort({"battle_at":"desc"}).limit(100);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})