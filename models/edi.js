const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
  coursename: {
    require: true,
    type: String,
    trim: true,
  },
  courseid: {
    require: true,
    type: String,
    trim: true,
  },
  courseinfo: {
    require: true,
    type: [],
  },
});

const allData = mongoose.model("Attendance", attendanceSchema);

module.exports = allData;
