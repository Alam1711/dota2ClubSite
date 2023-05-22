const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const nbdaproject3 = new Schema(
  {
    title: { type: String, required: [true, "title is required"] },
    host: { type: Schema.Types.ObjectId, ref: "User" },
    details: {
      type: String,
      required: [true, "details is required"],
      minLength: [10, "Necessary character length of 10"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
      maxLength: [20, "Maximum character length of 20"],
    },
    requiredRank: {
      type: String,
      required: [true, "Rank is required"],
      enum: [
        "Herald",
        "Guardian",
        "Crusader",
        "Archon",
        "Legend",
        "Ancient",
        "Divine",
        "Immortal",
      ],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Tournament", "Development Course"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    rsvp: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//Collection name is events in database
module.exports = mongoose.model("events", nbdaproject3);
