const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    // Vérifier que MONGODB_URL est défini
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }
    
    // Plus besoin des options useNewUrlParser et useUnifiedTopology
    const conn = mongoose.connect(process.env.MONGODB_URL);
    
    console.log("DATABASE Connected Successfully");
  } catch (error) {
    console.log("DATABASE error:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;