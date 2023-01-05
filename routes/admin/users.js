var express = require("express");
const { connectDb, closeconnection } = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET =process.env.JWT_SECRET;
var router = express.Router();

/* GET users listing. */

router.post("/register", async (req, res) => {
  // db connection
  try {  
    const db = await connectDb();
    // hasing - password secure
    var salt = await bcrypt.genSalt(10);
    var hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    const User = await db.collection("users").insertOne(req.body);
    await closeconnection();
    res.json({ message: "user created", id: User.insertedId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});



router.post("/login", async function (req, res, next) {
  try {
    const db = await connectDb();
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    await closeconnection();
    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "5m",
        });
        res.json({ message: "success", token });
      } else {
        res.status(401).json({ message: "incorrect UserName/Password " });
      }
    } else {
      res.status(401).json({ message: "incorrect UserName/Password " });
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

module.exports = router;
