const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RSVPSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "events",
  },
  response: {
    type: String,
    enum: ["Yes", "No", "Maybe"],
  },
});

//Collection name is events in database
module.exports = mongoose.model("RSVP", RSVPSchema);
