const multer = require("multer");

const storage = multer.memoryStorage(); // File in memory buffer (no disk)
const upload = multer({ storage });

module.exports = upload;
