const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Middleware d'authentification
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifie si l'en-tête d'autorisation commence par "Bearer"
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    
    // Extraction du token de l'en-tête d'autorisation
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        // Décodage du token avec la clé secrète pour extraire les informations utilisateur
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Recherche de l'utilisateur à partir de l'ID contenu dans le token
        const user = await User.findById(decoded?.id);

        // Si l'utilisateur n'est pas trouvé, lance une erreur
        if (!user) {
          throw new Error("User not found");
        }

        // Ajoute l'utilisateur trouvé à l'objet de la requête
        req.user = user;

        // Passe au middleware suivant
        next();
      }
    } catch (error) {
      // Capture les erreurs liées au token ou à la recherche utilisateur
      res.status(401).json({
        status: "fail",
        message: "Not authorized, token expired or invalid. Please login again.",
        error: error.message,
      });
    }
  } else {
    // Si aucun token n'est attaché à l'en-tête
    res.status(401).json({
      status: "fail",
      message: "No token attached to the header",
    });
  }
});

// Middleware pour vérifier si l'utilisateur est administrateur
const isAdmin = asyncHandler(async (req, res, next) => {
  // Vérifie si req.user est défini avant de tenter la déstructuration
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "Not authorized, user not found",
    });
  }

  const { email } = req.user;  // Extraction de l'email de l'utilisateur
  const adminUser = await User.findOne({ email });

  // Vérifie si l'utilisateur a un rôle d'administrateur
  if (adminUser?.role !== "admin") {
    res.status(403).json({
      status: "fail",
      message: "You are not authorized, admin access required",
    });
  } else {
    // Passe au middleware suivant si l'utilisateur est administrateur
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
