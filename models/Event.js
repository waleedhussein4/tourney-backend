const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    _id: { type: String, required: true, default: uuidv4 },
    title: { type: String, required: true },
    description: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    teams: [{ type: Schema.Types.String, ref: "Team" }],
    users: [{ type: Schema.Types.String, ref: "User" }]
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;