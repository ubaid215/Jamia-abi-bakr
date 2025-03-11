const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  dateOfAdmission: { type: Date, required: true },
  admissionNumber: { type: String, unique: true },
  rollNumber: { type: String, unique: true },
  idCardNumber: { type: String, unique: true },
  permanentAddress: { type: String, required: true },
  currentAddress: { type: String, required: true },
  fatherPhoneNumber: { type: String, required: true }, // Added Father's Phone Number
  classType: { type: String, required: true, enum: ["Hifz", "Nazra", "Dars-e-Nizami", "Academic",] },
  educationDetail: { type: String },
  teacherName: {type: String},
  profileImage: { type: String }, // Student's profile image
  fatherImage: { type: String }, // Father's image
  status: { type: String, default: "Active", enum: ["Active", "Inactive", "Graduated", "Suspended"] }, // Add this field
  guardian: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Guardian's Phone Number
    address: { type: String, required: true },
    officeAddress: { type: String },
  },
  agreedToTerms: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);