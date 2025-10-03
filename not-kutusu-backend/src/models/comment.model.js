const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, maxlength: 350 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reports: { type: Number, default: 0 }
}, { timestamps: true });

CommentSchema.index({ noteId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ reports: -1, createdAt: -1 });


module.exports = mongoose.model("Comment", CommentSchema, "Comment");
