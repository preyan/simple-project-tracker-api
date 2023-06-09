const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 1000,
});

module.exports = mongoose.model("Task", TaskSchema);
