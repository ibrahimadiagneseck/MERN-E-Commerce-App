const mongoose = require("mongoose"); // Importe mongoose pour gérer les interactions avec MongoDB

// Déclare le schéma pour le modèle MongoDB Cart (Panier)
var cartSchema = new mongoose.Schema(
  {
    // Définition du champ products, qui est un tableau contenant des objets avec les informations des produits
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId, // Référence à l'ID d'un document dans la collection "Product"
          ref: "Product", // Définit la référence pour les jointures (population) sur le modèle "Product"
        },
        count: Number, // Quantité du produit ajouté au panier
        color: String, // Couleur du produit (optionnel)
        price: Number, // Prix du produit au moment de l'ajout au panier
      },
    ],
    cartTotal: Number, // Total du panier sans remise
    totalAfterDiscount: Number, // Total du panier après application d'une éventuelle remise
    orderby: {
      type: mongoose.Schema.Types.ObjectId, // Référence à l'ID d'un document dans la collection "User"
      ref: "User", // Définit la référence pour les jointures sur le modèle "User"
    },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt pour suivre la date de création et de modification
  }
);

// Exporte le modèle "Cart" basé sur cartSchema pour l'utiliser dans d'autres fichiers
module.exports = mongoose.model("Cart", cartSchema);
