const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createCourse,
  getCourses,
  getCoursesByUniversity,
  getCoursesBySlug,
} = require("../controllers/course.controller");

router.post("/courses", authMiddleware, createCourse);              // Yeni ders ekle
router.get("/courses", getCourses);                                // Herkes görebilir
router.get("/courses/my-university", authMiddleware, getCoursesByUniversity);  // Kullanıcının üniversitesine özel
router.get("/:slug/courses", authMiddleware, getCoursesBySlug);

module.exports = router;
