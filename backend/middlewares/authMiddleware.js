const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Middleware d'authentification
const authMiddleware = asyncHandler(async (req, res, next) => {
  // console.log("🟢 authMiddleware - début");

  let token;

  // Vérifie si l'en-tête d'autorisation commence par "Bearer"
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    // console.log("🟢 authMiddleware - Header Authorization présent");
    
    // Extraction du token de l'en-tête d'autorisation
    token = req.headers.authorization.split(" ")[1];
    // console.log("🟢 authMiddleware - Token extrait:", token ? "Oui (longueur: " + token.length + ")" : "Non");

    try {
      if (token) {
        // Décodage du token avec la clé secrète
        // console.log("🟢 authMiddleware - Tentative de vérification JWT");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 🔓 LOG ACTIF - Montre ce qui est dans le token
        // console.log("📦 Decoded token:", decoded);
        // console.log("🆔 ID from token:", decoded?.id);

        // Recherche de l'utilisateur à partir de l'ID contenu dans le token
        // console.log("🔍 Recherche utilisateur avec ID:", decoded?.id);
        const user = await User.findById(decoded?.id).select('-password');

        // 🔓 LOG ACTIF - Montre si l'utilisateur est trouvé
        if (user) {
          // console.log("✅ User found:", user.email);
        } else {
          // console.log("❌ User NOT found with ID:", decoded?.id);
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found"
          });
        }

        // Ajoute l'utilisateur trouvé à l'objet de la requête
        req.user = user;

        // console.log("🟢 authMiddleware - SUCCÈS ! req.user défini pour:", user.email);
        // console.log("🟢 authMiddleware - Passage à next()");
        next();
      }
    } catch (error) {
      // console.log("🔴 authMiddleware - ERREUR JWT:", error.message);
      // console.log("🔴 authMiddleware - Stack:", error.stack);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token expired or invalid. Please login again."
      });
    }
  } else {
    // console.log("🔴 authMiddleware - PAS DE HEADER AUTHORIZATION BEARER");
    // console.log("Headers reçus:", Object.keys(req.headers));
    return res.status(401).json({
      success: false,
      message: "No token attached to the header"
    });
  }
});

// Middleware pour vérifier si l'utilisateur est administrateur
const isAdmin = asyncHandler(async (req, res, next) => {
  // console.log("🟢 isAdmin - début");
  
  // Vérifie si req.user est défini
  if (!req.user) {
    // console.log("🔴 isAdmin - req.user non défini");
    return res.status(401).json({
      success: false,
      message: "Not authorized, user not found"
    });
  }

  // console.log("🟢 isAdmin - Utilisateur:", req.user.email, "Rôle:", req.user.role);

  // Vérifie si l'utilisateur a un rôle d'administrateur
  if (req.user?.role !== "admin") {
    // console.log("🔴 isAdmin - Accès refusé, rôle non admin");
    return res.status(403).json({
      success: false,
      message: "You are not authorized, admin access required"
    });
  }
  
  // console.log("🟢 isAdmin - SUCCÈS, admin autorisé");
  // Passe au middleware suivant
  next();
});

module.exports = { authMiddleware, isAdmin };