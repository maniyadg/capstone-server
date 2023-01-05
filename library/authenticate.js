const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;



function authorize
  (req, res, next) {
  try {
    // check if authorization token is present
    if (req.headers.authorization) {
      // check if tocken is valid
      let decodedtoken = jwt.verify(req.headers.authorization, JWT_SECRET);
      // if valid go next()
      if (decodedtoken) {
        next();
      } else {
        res.status(401).json({ message: "unauthorized" });
      }
    }
  } catch (error) {
    // else say unauthorized
    res.status(401).json({ message: "unauthorized" });
  }
}

module.exports = { authorize }