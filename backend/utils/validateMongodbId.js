const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
  console.log("🔍 validateMongoDbId - ID reçu:", id);
  console.log("🔍 Type de l'ID:", typeof id);
  
  // Convertir en string si c'est un ObjectId
  const idString = id?.toString ? id.toString() : id;
  console.log("🔍 ID après conversion:", idString);
  
  const isValid = mongoose.Types.ObjectId.isValid(idString);
  console.log("🔍 ID valide ?", isValid);
  
  if (!isValid) {
    console.error("❌ ID invalide détecté:", idString);
    throw new Error("This id is not valid or not found");
  }
};

module.exports = validateMongoDbId;