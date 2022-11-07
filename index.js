const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connection = require("./Config/db");

const TodoRoute = require("./Routes/todo.route")
const UserModel = require("./Models/User.model");
require("dotenv").config();

const app = express();
app.use("/todo",TodoRoute)

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welocme Home");
});

//Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const isUser = await UserModel.findOne({ email });
  // res.send(req.body)
  if (isUser) {
    res.send({ msg: "Users already exists please try with diffrent email" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something went wrong please try again " });
      }
      const new_user = new UserModel({ name, email, password: hash });
      try {
        await new_user.save();
        res.send({ msg: "Signup Successfull" });
      } catch (error) {
        res.send({ msg: "Something went wrong" });
      }
    });
  }
});






//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hashed_pass = user.password;
  const user_id = user._id;
  bcrypt.compare(password, hashed_pass, function (err, result) {
    if (err) {
      res.send({ msg: "Something went wrong" });
    }
    if (result) {
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
      res.send({ msg: "login successfull", token });
    } else {
      res.send({ msg: "login failed,try again" });
    }
  });
});




//Connection

app.listen(process.env.PORT || 8000, async (req, res) => {
  try {
    await connection;
    console.log("connection successfull");
  } catch (error) {
    console.log("connection to db failed");
    console.log(error);
  }
  console.log(`listening on port ${process.env.PORT}`);
});
