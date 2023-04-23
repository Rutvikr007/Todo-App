const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(201).json({ msg: "invalid user" });
  }

  try {
    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decoded.userId);

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: " Not authorized" });
  }
};

module.exports = verifyUser;
