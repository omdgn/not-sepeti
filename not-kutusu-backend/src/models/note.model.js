const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  instructor: { type: String },
  driveLink: { type: String, required: true },
  year: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  description: { type: String },
  reactions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      type: { type: String, enum: ["like", "dislike", "report"], required: true },
      processDescription: { type: String, maxlength: 200 },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

NoteSchema.index({ universityId: 1 });
NoteSchema.index({ courseId: 1 });
NoteSchema.index({ createdBy: 1 });
NoteSchema.index({ "reactions.userId": 1 });
NoteSchema.index({ likes: -1, reports: -1, createdAt: -1 });
NoteSchema.index({
  title: "text",
  description: "text",
  instructor: "text",
  year: "text"
});


module.exports = mongoose.model("Note", NoteSchema, "Note");
