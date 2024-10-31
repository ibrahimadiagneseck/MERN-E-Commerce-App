const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();


router.post(
  "/",
  authMiddleware, // Vérifie que l'utilisateur est authentifié avant d'accéder à la route.
  isAdmin, // Vérifie que l'utilisateur a les droits d'administrateur, garantissant que seuls les administrateurs peuvent télécharger des images.
  uploadPhoto.array("images", 10), // Utilise `uploadPhoto` pour gérer le téléchargement de fichiers et spécifie que jusqu'à 10 images peuvent être envoyées dans le champ `images`.
  productImgResize, // Redimensionne les images téléchargées pour répondre aux exigences de taille et de qualité de l'application.
  uploadImages // Fonction finale qui prend les images téléchargées et les traite en les enregistrant dans la base de données ou le stockage approprié.
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
