const mongoose = require("mongoose");

const DepartmentCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, trim: true, uppercase: true },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

DepartmentCodeSchema.index({ universityId: 1 });
DepartmentCodeSchema.index({ code: 1, universityId: 1 }, { unique: true });

module.exports = mongoose.model("DepartmentCode", DepartmentCodeSchema, "DepartmentCode");
