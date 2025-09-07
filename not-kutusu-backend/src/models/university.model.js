const mongoose = require("mongoose");

const UniversitySchema = new mongoose.Schema({
  name: { type: String, required: true },               // "Boğaziçi Üniversitesi"
  slug: { type: String, required: true, unique: true }, // "bogazici"
  emailDomains: [String],                               // ["boun.edu.tr"]
}, { timestamps: true });


module.exports = mongoose.model("University", UniversitySchema, "University");

