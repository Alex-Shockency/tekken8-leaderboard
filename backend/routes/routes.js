const express = require("express");

const router = express.Router();
const Replay = require("../models/replay");
const Ranking = require("../models/ranking");

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

module.exports = router;

router.get("/rankings", async (req, res) => {
  try {
    let data = await Ranking.find();
    let rankingsByPlayer = [];

    data.forEach((ranking) => {
      rankings = [];
      qualRankings = [];

      ranking.characters.forEach((char) => {
        if (char.qualified) {
          qualRankings.push(char)
          rankings.push(char)
        } else {
          rankings.push(char)
        }
      })

      rankingsByPlayer.push({
        name: ranking.name,
        tekken_id: ranking._id,
        rankings: rankings.sort((char1, char2) => {
          return char2.rating - char1.rating;
        }),
        qual_rankings: qualRankings.sort((char1, char2) => {
          return char2.rating - char1.rating;
        })
      })
    });


    res.json(rankingsByPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rankings/:tekkenId", async (req, res) => {
  try {
    const data = await Ranking.find({ "_id": req.params.tekkenId });
    let rankingsByPlayer = {};

    rankings = [];
    qualRankings = [];


    data.forEach((ranking) => {
      ranking.characters.forEach((char) => {
        if (char.qualified) {
          qualRankings.push(char)
          rankings.push(char)
        } else {
          rankings.push(char)
        }
      })

      rankingsByPlayer = ({
        name: ranking.name,
        tekken_id: req.params.tekkenId,
        rankings: rankings,
        qual_rankings: qualRankings
      });
    });


    res.json(rankingsByPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/lastEpochUpdate", async (req, res) => {
  try {
    const data = await Replay.find().sort({ battle_at: -1 }).limit(1);
    res.json({ date: data[0].battle_at });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/lastupdate", async (req, res) => {
  try {
    const data = await Replay.find().sort({ battle_at: -1 }).limit(1);
    const date = data[0].battle_at * 1000
    res.json({ date: date });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Method
router.get("/replays", async (req, res) => {
  try {
    const data = await Replay.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by TekkenID Method
router.get("/replays/:tekkenId", async (req, res) => {
  try {
    let data = await Replay.find({
      $or: [
        { p1_polaris_id: req.params.tekkenId },
        { p2_polaris_id: req.params.tekkenId },
      ],
    })
      .sort({ battle_at: "desc" })
    // .limit(100);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Method
router.get("/qualifiedReplays", async (req, res) => {
  try {
    let lowerBound = Math.floor(Date.now() / 1000) - (2629743)
    const data = await Replay.find({ "battle_at": { $gt: lowerBound } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
