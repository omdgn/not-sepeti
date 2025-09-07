const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true },                      // "BLG-231E"
  name: { type: String, required: true },                      // "Veritabanı Sistemleri"
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
  noteCount: { type: Number, default: 0 }                      // toplam not sayısı (isteğe bağlı güncellenir)
}, { timestamps: true });

CourseSchema.index({ universityId: 1 });
CourseSchema.index({ code: "text", name: "text" });

module.exports = mongoose.model("Course", CourseSchema, "Course");

