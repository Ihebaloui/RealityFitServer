const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
console.log(token)
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyEmail = async(req, res, next)=>{
  try {
    const user = await User.findOne({
      email : req.body.email
    })
    if(user.isVerified){
      next()
    }else{
      console.log("please check your email to verify your account")
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = verifyEmail, verifyToken;