const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  tekkenId: {
    required: true,
    type: Object,
  },
  displayName: {
    required: true,
    type: String,
  },
  platform: {
    required: true,
    type: String,
  },
  state: {
    required: true,
    type: Boolean,
  },
  platformId: {
    required: true,
    type: Object,
  },
});

module.exports = mongoose.model("Player", dataSchema, "players");
