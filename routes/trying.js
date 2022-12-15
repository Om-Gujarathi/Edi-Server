const allData = require("../models/edi");
const express = require("express");

const authRouter = express.Router();

authRouter.post("/edi/addcourse", async (req, res) => {
  try {
    const { coursename, courseid, courseinfo } = req.body;

    const existingCourse = await allData.findOne({ courseid });
    if (existingCourse) {
      return res.status(400).json({ msg: "Same course already exists!" });
    }

    let course = new allData({
      coursename,
      courseid,
      courseinfo,
    });

    course = await course.save();
    res.json(course);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

authRouter.post("/edi/adddate", async (req, res) => {
  try {
    const { courseid, adddate } = req.body;

    const existingCourse = await allData.findOne({ courseid });
    if (!existingCourse) {
      return res.status(401).json({ msg: "This Course does not exist!" });
    }

    const query = { courseid };

    const thatdoc = allData.findOne(query);

    var result = await thatdoc.updateOne(
      {
        courseid: courseid,
      },
      {
        $push: {
          courseinfo: {
            date: adddate,
            modify: "false",
            classattendance: {},
          },
        },
      }
    );

    res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

authRouter.post("/edi/addattendance", async (req, res) => {
  try {
    const { courseid, date, prn, attended } = req.body;

    const existingCourse = await allData.findOne({ courseid });
    if (!existingCourse) {
      return res.status(401).json({ msg: "This Course does not exist!" });
    }
  
    const existingDate = await allData.findOne({ date });
    if (!existingDate) {
      return res.status(401).json({ msg: "This Date does not exist!" });
    }

    const query = { courseid };

    const thatdoc = allData.findOne(query);

    let toset = `courseinfo.$.classattendance.${prn}`;

    var result = await thatdoc.updateOne(
      {
        "courseinfo.date": date,
      },
      {
        $set: {
          [toset]: "PRESENT",
        },
      }
    );

    res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

authRouter.post("/edi/modifyOn", async (req, res) => {
  try {
    const { courseid, date } = req.body;

    const existingCourse = await allData.findOne({ courseid });
    if (!existingCourse) {
      return res.status(401).json({ msg: "This Course does not exist!" });
    }

    const existingDate = await allData.findOne({ date });
    if (!existingCourse) {
      return res.status(401).json({ msg: "This Date does not exist!" });
    }

    var result = await allData.updateOne(
      {
        "courseinfo.date": date,
      },
      {
        $set: {
          "courseinfo.$.modify": "true",
        },
      }
    );

    res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

authRouter.post("/edi/modifyOff", async (req, res) => {
  try {
    const { courseid, date } = req.body;

    const existingCourse = await allData.findOne({ courseid });
    if (!existingCourse) {
      return res.status(401).json({ msg: "This Course does not exist!" });
    }

    const existingDate = await allData.findOne({ date });
    if (!existingCourse) {
      return res.status(401).json({ msg: "This Date does not exist!" });
    }

    var result = await allData.updateOne(
      {
        "courseinfo.date": date,
      },
      {
        $set: {
          "courseinfo.$.modify": "false",
        },
      }
    );

    res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

authRouter.post("/edi/howIsModify", async (req, res) => {
  try {
    const { courseid, date } = req.body;

    const existingCourse = await allData.findOne({ courseid });
    if (!existingCourse) {
      return res.status(401).json({ msg: "This Course does not exist!" });
    }

    const existingDate = await allData.findOne({ date });
    if (!existingDate) {
      return res.status(401).json({ msg: "This Date does not exist!" });
    }

    // let result = await allData.aggregate([
    //   {
    //     $match: { "courseinfo.date": date },
    //   },
    // ]);

    var result = await allData.find(
      { "courseinfo.date": date , courseid},
      {
        "courseinfo.$": 1,
        _id : 0
      }
    );
    // var res2 = result.find({ "courseinfo.date": "3 Nov" });
    // console.log(res2);


    res.json({ result});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = authRouter;
