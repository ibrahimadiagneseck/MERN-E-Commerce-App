const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  console.log("\n🔐 AUTH MIDDLEWARE - Début");
  console.log("Headers reçus:", req.headers.authorization);
  
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("✅ Token extrait:", token.substring(0, 20) + "..."); // Affiche début du token
  } else {
    console.log("❌ Pas de token dans les headers");
    console.log("Headers complets:", req.headers);
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    console.log("🔑 Vérification du token JWT...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé, userId:", decoded.id);
    
    console.log("🔍 Recherche de l'utilisateur en base...");
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      console.log("❌ Utilisateur non trouvé avec l'ID:", decoded.id);
      res.status(401);
      throw new Error("User not found");
    }
    
    console.log("✅ Utilisateur authentifié:", req.user.email);
    console.log("✅ Auth middleware terminé avec succès");
    
    next();
  } catch (error) {
    console.error("❌ Erreur dans authMiddleware:", error.message);
    console.error("Stack:", error.stack);
    res.status(401);
    throw new Error("Not authorized, token failed");
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