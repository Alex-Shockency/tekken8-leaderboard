const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  tekkenId: {
    required: true,
    type: Object,
  },
  state: {
    required: true,
    type: String,
  },
  isAdmin: {
    required: true,
    type: Boolean,
  },
});

module.exports = mongoose.model("User", dataSchema, "users");
