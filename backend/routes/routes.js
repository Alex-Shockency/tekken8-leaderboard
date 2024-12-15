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
      if (!rankingsByPlayer.some((p) => p.name == ranking.name)) {
        let maxRating = -1;
        let maxChara = -1;
        let maxRank = -1;
        //That crazy number is the minimum date val
        let lastSeen = new Date(-8640000000000000);
        let maxQualRating = -1;
        let maxQualChara = -1;
        let maxQualRank = -1;
        //That crazy number is the minimum date val
        let lastQualSeen = new Date(-8640000000000000);
        let tekkenId = ranking._id;
        ranking.characters.forEach((char) => {
          if (char.qualified) {
            if (char.rating > maxQualRating) {
              maxQualRating = char.rating
              maxQualChara = char.id
              maxQualRank = char.rank
              lastQualSeen = new Date(char.date).toLocaleDateString("en-us", options);
            }
          } else {
            if (char.rating > maxRating) {
              maxRating = char.rating
              maxChara = char.id
              maxRank = char.rank
              lastSeen = new Date(char.date).toLocaleDateString("en-us", options);
            }
          }
         
        })


        rankingsByPlayer.push({
          name: ranking.name,
          tekken_id: tekkenId,
          max_rating: maxRating,
          max_chara: maxChara,
          max_rank: maxRank,
          max_qual_rating: maxQualRating,
          max_qual_chara: maxQualChara,
          max_qual_rank: maxQualRank,
          last_seen: lastSeen,
          last_qual_seen: lastQualSeen,
        });
      }
    });

    rankingsByPlayer = rankingsByPlayer.sort((player1, player2) => {
      return player2.max_rating - player1.max_rating;
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
    //That crazy number is the minimum date val


    data.forEach((ranking) => {
      //That crazy number is the minimum date val
      ranking.characters.forEach((char) => {
        if (char.qualified) {
          qualRankings.push(char)
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
    const date = new Date(data[0].battle_at * 1000).toLocaleDateString(
      "en-us",
      options
    );
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
