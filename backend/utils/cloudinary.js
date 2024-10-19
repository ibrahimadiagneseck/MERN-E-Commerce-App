// Importation de la bibliothèque Cloudinary pour gérer le stockage des fichiers sur le cloud
const cloudinary = require("cloudinary");

// Configuration de Cloudinary avec les variables d'environnement pour protéger les informations sensibles
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Nom du cloud Cloudinary
  api_key: process.env.API_KEY,        // Clé API pour authentifier les requêtes
  api_secret: process.env.SECRET_KEY,  // Clé secrète API pour la sécurité
});

// Fonction pour télécharger une image sur Cloudinary
const cloudinaryUploadImg = async (fileToUploads) => {
  // Retourne une promesse pour s'assurer que l'opération de téléchargement est asynchrone
  return new Promise((resolve) => {
    // Utilisation de la méthode d'upload de Cloudinary pour envoyer le fichier
    cloudinary.uploader.upload(fileToUploads, (result) => {
      // Résolution de la promesse avec les informations importantes de l'image téléchargée
      resolve(
        {
          url: result.secure_url,       // URL sécurisée où l'image est accessible
          asset_id: result.asset_id,    // ID unique de l'image dans Cloudinary
          public_id: result.public_id,  // ID public pour accéder ou manipuler l'image
        },
        {
          resource_type: "auto",        // Le type de fichier est automatiquement détecté (image, vidéo, etc.)
        }
      );
    });
  });
};

// Fonction pour supprimer une image de Cloudinary
const cloudinaryDeleteImg = async (fileToDelete) => {
  // Retourne une promesse pour s'assurer que l'opération de suppression est asynchrone
  return new Promise((resolve) => {
    // Utilisation de la méthode de suppression de Cloudinary pour détruire l'image
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      // Résolution de la promesse avec les informations de l'image supprimée
      resolve(
        {
          url: result.secure_url,       // URL de l'image (inaccessible après suppression)
          asset_id: result.asset_id,    // ID unique de l'image (inutilisable après suppression)
          public_id: result.public_id,  // ID public de l'image supprimée
        },
        {
          resource_type: "auto",        // Le type de fichier est automatiquement détecté (image, vidéo, etc.)
        }
      );
    });
  });
};

// Exportation des fonctions pour les utiliser dans d'autres fichiers
module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
