const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,    // Otomatik büyük harf
    trim: true          // Boşlukları temizle
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true
  },
  noteCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes
CourseSchema.index({ universityId: 1 });
CourseSchema.index({ code: 1, universityId: 1 }, { unique: true }); // Unique constraint
CourseSchema.index({ code: "text" }); // Text search
CourseSchema.index({ universityId: 1, noteCount: -1 }); // Popüler dersler

module.exports = mongoose.model("Course", CourseSchema, "Course");

