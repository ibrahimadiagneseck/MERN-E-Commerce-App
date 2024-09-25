const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token; 

  // Vérifie si l'en-tête d'autorisation commence par "Bearer"
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    // Extraction du token de l'en-tête
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        // Décodage du token avec la clé secrète pour extraire les informations utilisateur
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Recherche de l'utilisateur en base de données à partir de l'ID contenu dans le token
        const user = await User.findById(decoded?.id);

        // Ajoute l'utilisateur trouvé à l'objet de la requête pour un usage ultérieur
        req.user = user;

        // Passe à l'étape suivante si l'utilisateur est authentifié avec succès
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token expired, Please Login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

// Middleware pour vérifier si l'utilisateur est administrateur (à implémenter)
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    throw new Error("You are not a admin");
  } else {
    next();
  }
  
});

module.exports = { authMiddleware, isAdmin };
