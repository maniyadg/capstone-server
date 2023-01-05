var express = require("express");
var router = express.Router();
const { connectDb, closeconnection } = require("../../config");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET =process.env.JWT_SECRET;
const mongodb = require("mongodb");



router.post("/forget", async (req, res) => {
    try {
        const db = await connectDb();
        const user = await db
            .collection("users")
            .findOne({ email: req.body.email });
            await closeconnection();
        if (!user) {
            res.json({ message: "User doesn't exist" });
        }
        const secret = user.password + JWT_SECRET;
        const token = jwt.sign({ _id: user._id, email: user.email }, secret, {
            expiresIn: "5m",
        });
        console.log(token)
        const link = `https://63b6a50e1cd7000f1fd798f2--famous-biscotti-024ad8.netlify.app/admin/user/reset-password/${user._id}/${token}`;
        console.log(link);

        let transporter = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });

        // send mail with defined transport object
        let details = {
            from: process.env.USER, // sender address
            to: req.body.email, // list of receivers
            subject: "Reset-Password", // Subject line
            text: link,
        };

        transporter.sendMail(details, (err) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("email sent");
            }
        });
        res.json({link , message:"Link Sended"})
    } catch (error) { }
});


router.put("/reset-password/:id/:token", async (req, res) => {
    const {  token } = req.params;
    const { password } = req.body;
  try {
    const db = await connectDb();
    const userdata = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (!userdata) {
      res.json({ message: "User doesn't exist" });
    }
    const secret = userdata.password + JWT_SECRET;
    const verify = jwt.verify(token, secret);
    const confirmPassword = await bcrypt.hash(password, 10);
    const user = await db.collection("users").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
      },
      {
        $set: {
            password: confirmPassword,
        },
      }
    );
    await closeconnection();
    res.json({ email: verify.email, status: "verified",message:"Password Updated Successfully"});
  } catch (error) {
    console.log(error)
    res.json({ status: "Something Went Wrong" });
  }
});



module.exports = router;
