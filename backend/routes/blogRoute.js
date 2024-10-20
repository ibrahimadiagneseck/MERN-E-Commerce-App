const express = require("express"); // Importation du module express
const {
  createBlog,       // Fonction pour créer un blog
  updateBlog,       // Fonction pour mettre à jour un blog
  getBlog,          // Fonction pour obtenir un blog spécifique
  getAllBlogs,      // Fonction pour obtenir tous les blogs
  deleteBlog,       // Fonction pour supprimer un blog
  liketheBlog,      // Fonction pour liker un blog
  disliketheBlog,   // Fonction pour disliker un blog
  uploadImages,     // Fonction pour uploader des images
} = require("../controller/blogCtrl"); // Importation des contrôleurs de blog

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); // Importation des middlewares d'authentification
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImage"); // Importation des middlewares pour le traitement des images

const router = express.Router(); // Création d'un routeur express

// Route pour créer un blog (accessible seulement par un admin authentifié)
router.post("/", authMiddleware, isAdmin, createBlog);

// Route pour uploader des images pour un blog spécifique
// Nécessite une authentification et des droits d'admin
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2), // Limite à 2 images
  blogImgResize, // Middleware pour redimensionner les images
  uploadImages // Fonction pour gérer l'upload des images
);

// Route pour liker un blog (accessible par un utilisateur authentifié)
router.put("/likes", authMiddleware, liketheBlog);

// Route pour disliker un blog (accessible par un utilisateur authentifié)
router.put("/dislikes", authMiddleware, disliketheBlog);

// Route pour mettre à jour un blog spécifique (accessible seulement par un admin authentifié)
router.put("/:id", authMiddleware, isAdmin, updateBlog);

// Route pour obtenir un blog spécifique par son ID
router.get("/:id", getBlog);

// Route pour obtenir tous les blogs
router.get("/", getAllBlogs);

// Route pour supprimer un blog spécifique (accessible seulement par un admin authentifié)
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router; // Exportation du routeur pour l'utiliser dans d'autres fichiers
