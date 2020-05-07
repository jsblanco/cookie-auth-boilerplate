const jwt = require("jsonwebtoken");

type userData = {
  _id: string;
  username: string;
  email: string;
};

module.exports = (userData: userData) => {
  const payload = {
      id: userData._id,
      username: userData.username,
      email: userData.email,
  };
  return jwt.sign(
    payload,
    process.env.SECRETKEY,
    {
      expiresIn: 31536000, // 1 Year
    }
  );
};