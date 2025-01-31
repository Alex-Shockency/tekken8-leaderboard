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
    type: String,
  },
  platformId: {
    required: true,
    type: Object,
  },
  isAdmin: {
    required: true,
    type: Boolean,
  },
});

module.exports = mongoose.model("Player", dataSchema, "players");
