const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    // const conn = mongoose.connect("mongodb://localhost:27017/digitic");
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("DATABASE Connected Successfully");
  } catch (error) {
    console.log("DATABASE error");
  }
};
module.exports = dbConnect;
