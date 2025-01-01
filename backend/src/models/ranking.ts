// const mongoose = require('mongoose');
import { Schema, model, InferRawDocType } from "mongoose";

const rankingSchemaDefinition = {
  _id: {
    required: true,
    type: Object,
  },
  name: {
    required: true,
    type: String,
  },
  characters: {
    required: true,
    type: Array,
  },
} as const;
const rankingSchema = new Schema(rankingSchemaDefinition);

const RankingModel = model("Ranking", rankingSchema, "players");

export type RankingSchemaType = InferRawDocType<typeof rankingSchemaDefinition>;

module.exports = RankingModel;
