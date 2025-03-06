const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: String,
  fatherName: String,
  dateOfBirth: Date,
  dateOfAdmission: Date,
  admissionNumber: { type: String, unique: true },
  rollNumber: { type: String, unique: true },
  idCardNumber: String,
  permanentAddress: String,
  currentAddress: String,
  phoneNumber: String,
  classType: { type: String, enum: ['Hifz', 'Nazra', 'Dars-e-Nizami'] },
  educationDetail: String,
  guardian: {
    name: String,
    relation: String,
    phoneNumber: String,
    address: String,
    officeAddress: String
  },
  agreedToTerms: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
