const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  // Vérifier que JWT_SECRET est défini
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

module.exports = { generateRefreshToken };