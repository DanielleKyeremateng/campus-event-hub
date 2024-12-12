const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Path `title` is required."],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Path `date` is required."],
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Path `time` is required."],
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):?([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      required: [true, "Path `type` is required."],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["confirmed", "waitlisted", "cancelled"],
          default: "confirmed",
        },
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
    ticketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    maxTicketsPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },
    registrationDeadline: Date,
    cancellationPolicy: String,
  },
  {
    timestamps: true,
  }
);

// Virtual field for current attendance count
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.filter((a) => a.status === "confirmed").length;
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
