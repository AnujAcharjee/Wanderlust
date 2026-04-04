const path = require("path");
const fs = require("fs");
const multer = require("multer");
const ExpressError = require("./ExpressError.js");

const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}-${random}${ext}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    return cb(new ExpressError(400, "Only image files are allowed."));
  }
  return cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFileFilter });

module.exports = { upload, uploadsDir, imageFileFilter };
