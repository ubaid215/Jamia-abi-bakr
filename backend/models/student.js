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
  fatherPhoneNumber: {
    type: String,
    required: function () {
      return this.isNew; // Only required for new documents (registration)
    },
  },
  classType: { 
    type: String, 
    required: true, 
    enum: ["Hifz", "Nazra", "Dars-e-Nizami", "Academic"] 
  },
  educationDetail: { type: String },
  teacherName: { type: String },
  profileImage: { type: String }, // Student's profile image
  fatherImage: { type: String }, // Father's image
  status: { 
    type: String, 
    default: "Active", 
    enum: ["Active", "Inactive", "Graduated", "Suspended"] 
  }, 
  guardian: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: function () {
        return this.isNew; // Only required for new documents (registration)
      },
    },
    address: { type: String, required: true },
    officeAddress: { type: String },
  },
  migrationHistory: [
    {
      date: {
        type: Date,
        default: Date.now, // Automatically set the migration date
      },
      fromClass: String, // Previous class type (optional)
      toClass: String, // New class type
      migratedBy: String, // Who performed the migration (e.g., admin ID or name)
    },
  ],
  agreedToTerms: { type: Boolean, default: false },
}, { timestamps: true });

// Fix OverwriteModelError
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

module.exports = Student;