const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  registerUser,
  authUser,
  allUsers,
  uploadImage,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.post("/profileImage", upload.single("ProfilePhoto"), uploadImage);
module.exports = router;
