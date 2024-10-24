// Importation du module 'jsonwebtoken' pour créer et vérifier des tokens JWT.
const jwt = require("jsonwebtoken");

// Fonction qui génère un token JWT en prenant l'identifiant d'un utilisateur (id) comme argument.
const generateToken = (id) => {
  // Utilisation de jwt.sign() pour créer un token :
  // - Le payload contient l'id de l'utilisateur.
  // - process.env.JWT_SECRET est la clé secrète utilisée pour signer le token, récupérée des variables d'environnement pour plus de sécurité.
  // - { expiresIn: "1d" } définit la durée de validité du token à 1 jour.
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Exportation de la fonction 'generateToken' pour l'utiliser dans d'autres fichiers.
module.exports = { generateToken };
