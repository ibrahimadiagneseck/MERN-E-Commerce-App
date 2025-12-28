const mongoose = require("mongoose"); // Importer la bibliothèque Mongoose pour interagir avec MongoDB
const bcrypt = require("bcrypt"); // Importer Bcrypt pour le hachage des mots de passe
const crypto = require("crypto"); // Importer Crypto pour la génération de tokens sécurisés


// Déclarer le schéma du modèle MongoDB
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String, // Type de données pour le prénom
      required: true, // Champ requis
    },
    lastname: {
      type: String, // Type de données pour le nom de famille
      required: true, // Champ requis
    },
    email: {
      type: String, // Type de données pour l'email
      required: true, // Champ requis
      unique: true, // Doit être unique dans la base de données
    },
    mobile: {
      type: String, // Type de données pour le numéro de mobile
      required: true, // Champ requis
      unique: true, // Doit être unique dans la base de données
    },
    password: {
      type: String, // Type de données pour le mot de passe
      required: true, // Champ requis
    },
    role: {
      type: String, // Type de données pour le rôle de l'utilisateur
      default: "user", // Valeur par défaut
    },
    isBlocked: {
      type: Boolean, // Type de données pour le statut de blocage
      default: false, // Valeur par défaut (non bloqué)
    },
    // cart: {
    //   type: Array, // Type de données pour le panier
    //   default: [], // Valeur par défaut (tableau vide)
    // },
    cart: {
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          count: Number,
          color: String,
          price: Number,
          subtotal: { 
            type: Number,
            default: 0
          }
        },
      ],
      cartTotal: {
        type: Number,
        default: 0,
      },
      totalAfterDiscount: {
        type: Number,
        default: 0,
      },
    },
    address: {
      type: String, // Type de données pour l'adresse
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Liste de souhaits, référencée à des objets "Product"
    refreshToken: {
      type: String, // Type de données pour le refresh token
    },
    passwordChangedAt: Date, // Date de la dernière modification du mot de passe
    passwordResetToken: String, // Token de réinitialisation du mot de passe
    passwordResetExpires: Date, // Date d'expiration du token de réinitialisation
  },
  {
    timestamps: true, // Active les timestamps pour createdAt et updatedAt
  }
);

// Middleware pour le hachage du mot de passe avant la sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Si le mot de passe n'est pas modifié, passe au middleware suivant
  }
  const salt = await bcrypt.genSaltSync(10); // Générer un sel pour le hachage
  this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
  next(); // Passe au middleware suivant
});

// Méthode pour comparer le mot de passe entré avec le mot de passe haché
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare les mots de passe
};

// Méthode pour créer un token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex"); // Générer un token aléatoire
  this.passwordResetToken = crypto
    .createHash("sha256") // Hacher le token
    .update(resettoken)
    .digest("hex"); // Convertir en chaîne hexadécimale
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // Définir la date d'expiration (30 minutes)
  return resettoken; // Retourner le token aléatoire non haché
};

// Exporter le modèle
module.exports = mongoose.model("User", userSchema); // Créer le modèle "User" à partir du schéma
