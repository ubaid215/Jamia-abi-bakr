const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp and original file name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images (JPEG, JPG, PNG) and PDFs are allowed!"), false);
  }
};

// Initialize multer with the storage configuration and file filter
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter,
});

module.exports = upload;