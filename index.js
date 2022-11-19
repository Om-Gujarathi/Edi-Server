//IMPORTS FROM PAKAGES
const express = require("express");
const mongoose = require("mongoose");

//IMPORTS FROM OTHER FILES
const authRouter = require("./routes/auth");
const tryingrouter = require("./routes/trying")
//INIT
const PORT = process.env.PORT || 3001;
const app = express();
const DB =
  "mongodb+srv://omgujarathi:2a3c232c2d@cluster0.wiqgz58.mongodb.net/?retryWrites=true&w=majority";
//CREATING AN API
//http://<youripaddress>/hello-world
// app.get("/", (req, res) => { //This callback function is going to run whenever we reach this path on that ip
//     res.json({name: "OM GUJARATHI"})
// })

//middleware
app.use(express.json());
app.use(authRouter);
app.use(tryingrouter);

//Connections
app.listen(PORT, "0.0.0.0", function () {
  console.log(`Connected at port :${PORT}`);
});
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Sucessful");
  })
  .catch((e) => {
    console.log(e);
  });
