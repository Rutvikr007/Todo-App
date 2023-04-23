const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
=======================================
      authentication Register user
========================================
*/

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).send("please fill all fields");
    return;
  }

  // checking if user already exist
  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(401).json({ msg: "user already  exist" });
  }

  // encrypting password before storing in db
  const hashedPassword = await bcrypt.hash(password, 10);

  // storing user in db
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  // generating token
  const token = jwt.sign(
    { userId: user._id, email, name },
    process.env.SECRET_KEY,
    { expiresIn: "10D" }
  );

  // response back to user
  res
    .status(201)
    .json({ user: user.name, email: user.email, _id: user._id, token: token });
};

/*
=======================================
      authentication Login user
========================================
*/
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("please fill all fields");
    return;
  }

  // finding email of user in db
  const user = await User.find({ email });
  if (user.length === 0) {
    return res
      .status(401)
      .json({ msg: "user not found , Register first please" });
  }

  // comparing password of user from db password
  const comparePassword = await bcrypt.compare(password, user[0].password);
  if (!comparePassword) {
    return res.status(401).json({ msg: "wrong password" });
  }

  // generating token
  const token = jwt.sign(
    { userId: user[0]._id, email: user[0].email, name: user[0].name },
    process.env.SECRET_KEY,
    { expiresIn: "1D" }
  );

  //=======================================
  //      // sending response back
  //========================================

  res.status(200).json({
    user: user[0].name,
    email: user[0].email,
    _id: user[0]._id,
    token: token,
  });
};

module.exports = {
  register,
  login,
};
