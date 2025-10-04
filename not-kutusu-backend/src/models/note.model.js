const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  instructor: { type: String, maxlength: 100 },
  driveLink: { type: String, required: true },
  year: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
  likes: { type: Number, default: 0, min: 0 },
  dislikes: { type: Number, default: 0, min: 0 },
  reports: { type: Number, default: 0, min: 0 },
  viewCount: { type: Number, default: 0, min: 0 },
  description: { type: String, maxlength: 550 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

NoteSchema.index({ universityId: 1 });
NoteSchema.index({ courseId: 1 });
NoteSchema.index({ createdBy: 1 });
NoteSchema.index({ likes: -1, reports: -1, createdAt: -1 });
NoteSchema.index({ isActive: 1, reports: -1 });
NoteSchema.index({
  title: "text",
  description: "text",
  instructor: "text",
  year: "text"
});

// Compound indexes for performance optimization
NoteSchema.index({ universityId: 1, isActive: 1, createdAt: -1 });
NoteSchema.index({ universityId: 1, isActive: 1, likes: -1 });


module.exports = mongoose.model("Note", NoteSchema, "Note");
