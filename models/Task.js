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
      required: [true, "Task title cannot be empty"],
    },
    description: {
      type: String,
      required: [true, "Task description cannot be empty"],
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

taskSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 1000,
});

module.exports = mongoose.model("Task", TaskSchema);
