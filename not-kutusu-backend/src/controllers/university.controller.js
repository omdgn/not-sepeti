const University = require("../models/university.model");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const Comment = require("../models/comment.model");
const Course = require("../models/course.model");

// Üniversiteleri listele (herkes erişebilir)
const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find();
    res.status(200).json({ universities });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

// Global istatistikler (herkes erişebilir)
const getGlobalStats = async (req, res) => {
  try {
    const [
      universityCount,
      userCount,
      noteCount,
      commentCount,
      totalLikes,
      topUniversities,
      topCourses
    ] = await Promise.all([
      University.countDocuments(),
      User.countDocuments(),
      Note.countDocuments(),
      Comment.countDocuments(),
      Note.aggregate([
        { $group: { _id: null, total: { $sum: "$likes" } } }
      ]).then(result => result[0]?.total || 0),
      Note.aggregate([
        { $group: { _id: "$universityId", noteCount: { $sum: 1 } } },
        { $sort: { noteCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "University",
            localField: "_id",
            foreignField: "_id",
            as: "university"
          }
        },
        { $unwind: "$university" },
        {
          $project: {
            name: "$university.name",
            slug: "$university.slug",
            noteCount: 1
          }
        }
      ]),
      Note.aggregate([
        { $group: { _id: "$courseId", noteCount: { $sum: 1 } } },
        { $sort: { noteCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "Course",
            localField: "_id",
            foreignField: "_id",
            as: "course"
          }
        },
        { $unwind: "$course" },
        {
          $lookup: {
            from: "University",
            localField: "course.universityId",
            foreignField: "_id",
            as: "university"
          }
        },
        { $unwind: "$university" },
        {
          $project: {
            courseName: "$course.name",
            courseCode: "$course.code",
            universityName: "$university.name",
            noteCount: 1
          }
        }
      ])
    ]);

    res.status(200).json({
      universityCount,
      userCount,
      noteCount,
      commentCount,
      totalLikes,
      topUniversities,
      topCourses
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

// Üniversiteye özgü istatistikler (slug bazlı)
const getUniversityStats = async (req, res) => {
  try {
    const { slug } = req.params;

    const university = await University.findOne({ slug });
    if (!university) {
      return res.status(404).json({ message: "Üniversite bulunamadı" });
    }

    const [userCount, noteCount] = await Promise.all([
      User.countDocuments({ universityId: university._id }),
      Note.countDocuments({ universityId: university._id })
    ]);

    res.status(200).json({
      university: {
        name: university.name,
        slug: university.slug
      },
      userCount,
      noteCount
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

module.exports = {
  getAllUniversities,
  getGlobalStats,
  getUniversityStats
};
