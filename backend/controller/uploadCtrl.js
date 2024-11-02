const fs = require("fs"); // Import du module fs pour gérer les fichiers (File System)
const asyncHandler = require("express-async-handler"); // Middleware qui gère les erreurs dans les fonctions async pour Express

// Import des fonctions utilitaires pour gérer le téléchargement et la suppression des images via Cloudinary
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

/**
 * Fonction pour télécharger des images sur Cloudinary
 * Elle utilise un gestionnaire async pour gérer les exceptions.
 * @param {Object} req - Objet requête d'Express contenant les fichiers téléchargés
 * @param {Object} res - Objet réponse d'Express pour envoyer les réponses au client
 */
const uploadImages = asyncHandler(async (req, res) => {
  try {
    // Fonction de téléversement qui prend le chemin de l'image et la télécharge sur Cloudinary
    const uploader = (path) => cloudinaryUploadImg(path, "images");

    const urls = []; // Tableau pour stocker les URLs des images téléchargées
    const files = req.files; // Récupère les fichiers uploadés de la requête

    // Boucle à travers chaque fichier uploadé
    for (const file of files) {
      const { path } = file; // Récupère le chemin temporaire du fichier sur le serveur
      const newpath = await uploader(path); // Téléverse l'image sur Cloudinary et récupère le nouveau chemin (URL)
      console.log(newpath); // Affiche l'URL de l'image dans la console
      urls.push(newpath); // Ajoute l'URL de l'image dans le tableau
      // fs.unlinkSync(path); // Supprime l'image temporaire du serveur après téléversement
    }

    // Crée un tableau d'images à partir des URLs
    const images = urls.map((file) => {
      return file; // Retourne chaque URL d'image (peut être simplifié en `urls`)
    });

    res.json(images); // Envoie la réponse au client avec les URLs des images
  } catch (error) {
    throw new Error(error); // Lance une nouvelle erreur si quelque chose se passe mal
  }
});

/**
 * Fonction pour supprimer une image de Cloudinary
 * @param {Object} req - Objet requête d'Express contenant l'ID de l'image à supprimer
 * @param {Object} res - Objet réponse d'Express pour envoyer les réponses au client
 */
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params; // Récupère l'ID de l'image à supprimer à partir des paramètres de la requête
  try {
    const deleted = cloudinaryDeleteImg(id, "images"); // Supprime l'image de Cloudinary en fonction de l'ID
    res.json({ message: "Deleted" }); // Renvoie une réponse de confirmation
  } catch (error) {
    throw new Error(error); // Lance une nouvelle erreur en cas de problème
  }
});

// Export des fonctions pour les utiliser dans d'autres parties de l'application
module.exports = {
  uploadImages,
  deleteImages,
};
