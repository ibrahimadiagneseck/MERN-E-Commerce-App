const mongoose = require("mongoose");

// const validateMongoDbId = (id) => {
//   const isValid = mongoose.Types.ObjectId.isValid(id);
//   if (!isValid) {
//     throw new Error("This id is not valid or not found");
//   }
//   return true;
// };

const validateMongoDbId = (id) => {
  // Convertir en string si c'est un ObjectId
  const idString = id?.toString ? id.toString() : id;
  const isValid = mongoose.Types.ObjectId.isValid(idString);
  if (!isValid) throw new Error("This id is not valid or not found");
};

module.exports = validateMongoDbId;