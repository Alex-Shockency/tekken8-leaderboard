const express = require("express");
var bodyParser = require("body-parser");

const router = express.Router();
const Replay = require("../models/replay");
const Player = require("../models/player");
const { checkJwt, isStateCodeValid } = require("../utils");
const User = require("../models/user");

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

module.exports = router;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

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

router.get("/rankings/character/:charId", async (req, res) => {
  try {
    let charId = Number.parseInt(req.params.charId) 
    let data = await Player.aggregate([ {
      '$match': {
        '$and': [
          {
            'characters.id': charId
          }, {
            'characters.qualified': true
          }
        ]
      }
    }, {
      '$addFields': {
        'characterRating': {
          '$filter': {
            'input': '$characters', 
            'as': 'item', 
            'cond': {
              '$eq': [
                '$$item.id', charId
              ]
            }
          }
        }
      }
    }, {
      '$match': {
        'characterRating.qualified': true
      }
    }, {
      '$sort': {
        'characterRating.rating': -1
      }
    }]).limit(100);

    let rankingsByPlayer = [];

    data.forEach((player) => {
      rankings = [];
      qualRankings = [];

      rankings.push(player.max_chara);
      if (!isEmpty(player.characterRating))
        qualRankings.push(...player.characterRating);

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
          console.log(char)
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

    rankingsByPlayer.qual_rankings = rankingsByPlayer.qual_rankings.sort((a,b) => {
      if(a.rating > b.rating){
        return -1
      }
    })

    rankingsByPlayer.rankings = rankingsByPlayer.rankings.sort((a,b) => {
      if(a.rating > b.rating){
        return -1
      }
    })

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

// Get Users
router.get("/user", checkJwt, async (req, res) => {
  try {
    const userData = await User.find({});
    if (!userData) {
      res
        .status(404)
        .json({ message: `No user found at ${req.params.userId}` });
    } else {
      res.json({
        userData,
      });
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
})

// User Handling
router.get("/user/:userId", checkJwt, async (req, res) => {
  try {
    const userData = await User.findById(req.params.userId);
    if (!userData) {
      res
        .status(404)
        .json({ message: `No user found at ${req.params.userId}` });
    } else {
      const { tekkenId } = userData;
      const playerData = await Player.findById(tekkenId);

      if (!playerData) {
        throw new Error(
          `Expected player data to be associated with found user. \nUser ID: ${userId}\nTekken ID: ${tekkenId}`
        );
      }

      res.json({
        userData,
        playerData,
      });
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/create", [checkJwt, jsonParser], async (req, res) => {
  // TODO: scrub Tekken ID better
  const { tekkenId, state, userId } = req.body;

  const session = await Player.startSession();
  session.startTransaction();

  try {
    // Verify input data
    const strippedTekkenId = tekkenId.split("-").join("");
    // Tekken ID validation
    if (!isStateCodeValid(state)) {
      return res
        .status(400)
        .json({ message: `Received unexpected state code: ${state}` });
    }

    // Find existing Player by form ID
    const player = await Player.findById(strippedTekkenId).session(session);
    if (!player) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Player not found" });
    } else if (player.is_approved) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message:
          "Player is already approved and associated with another account",
      });
    }

    // Create User entry at User ID
    await User.create(
      [
        {
          _id: userId,
          tekkenId: strippedTekkenId,
          state: state,
          isAdmin: false,
        },
      ],
      { session: session }
    );

    // Update Player to approved after creating User entry
    await Player.findOneAndUpdate(
      { _id: strippedTekkenId },
      { is_approved: true, state_id: state },
      { upsert: true, new: false, session: session }
    );

    await session.commitTransaction();
    session.endSession();

    res.send({ success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/update", [checkJwt, jsonParser], async (req, res) => {
  const { tekkenId, state, userId } = req.body;

  const session = await Player.startSession();
  session.startTransaction();

  try {
    // Verify input data
    const strippedTekkenId = tekkenId.split("-").join("");
    // Tekken ID validation
    if (!isStateCodeValid(state)) {
      return res
        .status(400)
        .json({ message: `Received unexpected state code: ${state}` });
    }

    // Find existing Player by form ID
    await Player.findOneAndUpdate(
      { _id: strippedTekkenId },
      { state_id: state },
      { upsert: true, new: false, session: session }
    );

    // Upsert User entry at User ID
    await User.findOneAndUpdate(
      { _id: userId },
      { state: state },
      { upsert: true, new: false, session: session }
    );

    await session.commitTransaction();
    session.endSession();

    res.send({ success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}
