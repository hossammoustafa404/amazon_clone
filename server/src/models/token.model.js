const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
