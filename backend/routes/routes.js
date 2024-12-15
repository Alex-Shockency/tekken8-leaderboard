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
  console.log("rankings")
  try {
    let data = await Ranking.find();
    let lowerBound = Math.floor(Date.now() / 1000) - (2629743)
    let rankingsByPlayer = [];

    data.forEach((ranking) => {
      if (!rankingsByPlayer.some((p) => p.name == ranking.name)) {
        qualRankings = [];
        rankings = [];
        let maxRating = -1;
        let maxChara = -1;
        let maxRank = -1;
        let lastSeen = new Date(-8640000000000000);
        let maxQualRating = -1;
        let maxQualChara = -1;
        let maxQualRank = -1;
        let lastQualSeen = new Date(-8640000000000000);
        let tekkenId = "";
        //That crazy number is the minimum date val

        data.forEach((tempRanking) => {
          if (ranking._id.tekken_id == tempRanking._id.tekken_id) {
            rankings.push(tempRanking)
            if (tempRanking.qualified) {
              qualRankings.push(tempRanking);
              if (maxQualRating < tempRanking.rating) {
                tekkenId = tempRanking._id.tekken_id;
                maxQualRating = tempRanking.rating;
                maxQualChara = tempRanking._id.chara_id;
                if (maxQualRank < tempRanking.rank) {
                  maxQualRank = tempRanking.rank;
                }
                if (lastQualSeen < tempRanking.date) {
                  lastQualSeen = tempRanking.date.toLocaleDateString("en-us", options);
                }
              }
            }
            if (maxRating < tempRanking.rating) {
              tekkenId = tempRanking._id.tekken_id;
              maxRating = tempRanking.rating;
              maxChara = tempRanking._id.chara_id;
              maxRank = tempRanking.rank;
              lastSeen = tempRanking.date.toLocaleDateString("en-us", options);
            }
          }
        });
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
          qual_rankings: qualRankings,
          rankings: rankings
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
    const data = await Ranking.find({ "_id.tekken_id": req.params.tekkenId });
    let rankingsByPlayer = {};


    rankings = [];
    qualRankings = [];

    let maxRating = 0;
    let maxChara = 0;
    let maxRank = 0;
    let lastSeen = new Date(-8640000000000000);
    let maxQualRating = -1;
    let maxQualChara = -1;
    let maxQualRank = -1;
    let lastQualSeen = new Date(-8640000000000000);
    let tekkenId = "";
    let userId = "";
    //That crazy number is the minimum date val


    data.forEach((tempRanking) => {
      rankings.push(tempRanking);
      if (tempRanking.qualified) {
        qualRankings.push(tempRanking);
        if (maxQualRating < tempRanking.rating) {
          tekkenId = tempRanking._id.tekken_id;
          maxQualRating = tempRanking.rating;
          maxQualChara = tempRanking._id.chara_id;
          if (maxQualRank < tempRanking.rank) {
            maxQualRank = tempRanking.rank;
          }
          if (lastQualSeen < tempRanking.date) {
            lastQualSeen = tempRanking.date.toLocaleDateString("en-us", options);
          }
        }
      }
      if (maxRating < tempRanking.rating) {
        tekkenId = tempRanking._id.tekken_id;
        maxRating = tempRanking.rating;
        maxChara = tempRanking._id.chara_id;
        maxRank = tempRanking.rank;
        lastSeen = tempRanking.date.toLocaleDateString("en-us", options);
      }



      rankings.sort((p1, p2) => p2.rating - p1.rating)
      qualRankings.sort((p1, p2) => p2.rating - p1.rating)
      rankingsByPlayer = ({
        name: tempRanking.name,
        tekken_id: tekkenId,
        max_rating: maxRating,
        max_chara: maxChara,
        max_rank: maxRank,
        max_qual_rating: maxQualRating,
        max_qual_chara: maxQualChara,
        max_qual_rank: maxQualRank,
        last_seen: lastSeen,
        last_qual_seen: lastQualSeen,
        user_id: userId,
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
