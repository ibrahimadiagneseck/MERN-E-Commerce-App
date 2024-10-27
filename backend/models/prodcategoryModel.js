const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var prodcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,       // Type de données : chaîne de caractères
      required: true,      // Champ requis : ne peut pas être vide
      unique: true,        // Doit être unique : empêche les doublons de noms de catégories
      index: true,         // Indexé pour accélérer les recherches
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("PCategory", prodcategorySchema);
