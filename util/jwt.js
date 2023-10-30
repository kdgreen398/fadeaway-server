const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY; // Replace with your actual secret key

module.exports = {
  secretKey,
  generateToken: (tokenPayload) => {
    return jwt.sign(tokenPayload, secretKey, { expiresIn: "1h" });
  },
  verifyToken: (token) => {
    return jwt.verify(token, secretKey);
  },
};
