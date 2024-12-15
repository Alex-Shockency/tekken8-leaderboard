require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');
const mongoString = process.env.DATABASE_URL;
const cors = require('cors');

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const Ranking = require("./models/ranking");
const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  

const app = express();
app.use(cors());

app.use('/api', routes)

app.use(express.json());

app.get('/home', async (req, res) => {
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

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})