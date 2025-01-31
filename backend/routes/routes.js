const express = require("express");

const router = express.Router();
const Replay = require("../models/replay");
const Player = require("../models/player");
const { checkJwt } = require("../utils");
// const require('body-parser');

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
    let data = await Player.find({ "max_qual_chara.id": { $exists: true } })
      .sort({ "max_qual_chara.rating": -1 })
      .limit(500);
    let rankingsByPlayer = [];

    data.forEach((player) => {
      rankings = [];
      qualRankings = [];

      // console.log(player)

      rankings.push(player.max_chara);
      if (!isEmpty(player.max_qual_chara))
        qualRankings.push(player.max_qual_chara);

      rankingsByPlayer.push({
        name: player.name,
        tekken_id: player._id,
        rankings: rankings,
        qual_rankings: qualRankings,
      });
    });
    res.json(rankingsByPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/players/:searchQuery", async (req, res) => {
  try {
    let data = await Player.find({
      name: { $regex: `^${req.params.searchQuery}`, $options: "i" },
    }).limit(500);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stateRankings/:stateId", async (req, res) => {
  try {
    let data = await Player.find({
      is_approved: true,
      state_id: req.params.stateId,
    });
    let rankingsByPlayer = [];

    data.forEach((player) => {
      rankings = [];
      qualRankings = [];

      rankings.push(player.max_chara);
      if (!isEmpty(player.max_qual_chara))
        qualRankings.push(player.max_qual_chara);

      rankingsByPlayer.push({
        name: player.name,
        tekken_id: player._id,
        rankings: rankings,
        qual_rankings: qualRankings,
      });
    });
    res.json(rankingsByPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rankings/:tekkenId", async (req, res) => {
  try {
    const data = await Player.find({ _id: req.params.tekkenId });
    let rankingsByPlayer = {};

    rankings = [];
    qualRankings = [];

    data.forEach((ranking) => {
      ranking.characters.forEach((char) => {
        if (char.qualified) {
          qualRankings.push(char);
          rankings.push(char);
        } else {
          rankings.push(char);
        }
      });

      rankingsByPlayer = {
        name: ranking.name,
        tekken_id: req.params.tekkenId,
        rankings: rankings,
        qual_rankings: qualRankings,
      };
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
    const date = data[0].battle_at * 1000;
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

router.get("/allReplays/:tekkenId", async (req, res) => {
  try {
    let data = await Replay.find(
      {
        $or: [
          { p1_polaris_id: req.params.tekkenId },
          { p2_polaris_id: req.params.tekkenId },
        ],
      },
      {
        p1_polaris_id: 1,
        p1_chara_id: 1,
        p2_chara_id: 1,
        p1_rounds: 1,
        p2_rounds: 1,
      }
    );
    // .limit(100);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by TekkenID Method
router.get("/replays/:tekkenId", async (req, res) => {
  let pageNum = req.query.pageNum;
  let pageSize = parseInt(req.query.pageSize);
  try {
    let data = await Replay.aggregate([
      {
        $match: {
          $or: [
            { p1_polaris_id: req.params.tekkenId },
            { p2_polaris_id: req.params.tekkenId },
          ],
        },
      },
      {
        $sort: {
          battle_at: -1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          replays: [{ $skip: (pageNum - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all Method
router.get("/qualifiedReplays", async (req, res) => {
  try {
    let lowerBound = Math.floor(Date.now() / 1000) - 2629743;
    const data = await Replay.find({ battle_at: { $gt: lowerBound } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Handling
router.post("/userData", checkJwt, (req, res) => {
  console.log("call to user-data endpoint");
  // Handle user form submissions
  console.log(req.body);
  res.send({ success: true });
});

// TODO: need RBAC on this endpoint
router.post("/approveUser", checkJwt, (req, res) => {
  console.log("call to approve-user endpoint");
  const { userId } = req.body;
  // Approve the user in the database
  res.send({ success: true, message: `User ${userId} approved.` });
});

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}
