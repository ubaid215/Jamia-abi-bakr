const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  classType: { type: String, required: true, enum: ["Hifz", "Nazra", "Dars-e-Nizami", "School"] }, // Add classType field
  cv: { type: String, required: true }, // Path to the uploaded CV file
  profileId: { type: String, unique: true }, // Auto-generated profile ID
});

// Auto-generate profileId before saving
teacherSchema.pre("save", function (next) {
  if (!this.profileId) {
    this.profileId = "TCH-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Teacher", teacherSchema);