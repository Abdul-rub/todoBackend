const jwt = require("jsonwebtoken");

const authentication = (req,res,next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res.send("You have to login");
  }
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  const user_id = decode.user_id;
  if (decode) {
    req.body.user_id = user_id;
    next();
  } else {
    res.send("You have to login");
  }
};
module.exports =  authentication;
