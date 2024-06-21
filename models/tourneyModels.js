const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tournamentSchema = new Schema(
  {
    _id: { type: Object },
    bank: { type: Number, default: 0 },
    UUID: { type: String, required: true, unique: true },
    host: {
      type: Schema.Types.String,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    enrolledUsers: [
      {
        UUID: {
          type: Schema.Types.String,
          ref: "User"
        },
        score: { type: Number },
        eliminated: { type: Boolean },
      }
    ],
    enrolledTeams: [
      {
        teamName: { type: String },
        players: [
          {
            UUID: {
              type: Schema.Types.String,
              ref: "User"
            },
            score: { type: Number, default: 0 },
            eliminated: { type: Boolean, default: false },
          }
        ],
        score: { type: Number },
        eliminated: { type: Boolean },
      }
    ],
    matches: [
      { type: String }
    ],
    entryFee: { type: Number, required: true },
    earnings: { type: Object },
    maxCapacity: { type: Number, required: true },
    accessibility: { type: String, required: true },
    hasStarted: { type: Boolean },
    hasEnded: { type: Boolean },
    description: { type: String },
    teamSize: { type: Number },
    acceptedUsers: [
      {
        type: Schema.Types.String,
        ref: "User",
      },
    ],
    acceptedTeams: [
      {
        type: Schema.Types.String,
        ref: "Team",
      },
    ],
    updates: [
      {
        date: { type: Date },
        content: { type: String },
      },
    ],
    application: [String],
    applications: [
      {
        UUID: { type: String },
        application: [
          {
            label: { type: String },
            input: { type: String },
          },
        ],
      },
    ],
    rules: { type: String },
    contactInfo: {
      email: { type: String },
      phone: { type: String },
      socialMedia: { 
        discord: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        facebook: { type: String },
      },
    }
  },
  { timestamps: true }
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
