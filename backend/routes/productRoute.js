const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  deleteImages
} = require("../controller/productCtrl");
const { productImgResize, uploadPhoto } = require("../middlewares/uploadImage"); // Importation des middlewares pour le traitement des images
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();


// router.put(
//   "/upload/:id",
//   authMiddleware,
//   isAdmin,
//   uploadPhoto.array("images", 2), // Limite à 2 images
//   productImgResize, // Middleware pour redimensionner les images // Redimensionner avant l'upload
//   uploadImages, // Fonction pour gérer l'upload des images // Uploader les images vers Cloudinary
// );

// Modification de la route - ajout du paramètre :id
router.put(
  "/upload/:id",  // ← Ajout du paramètre :id
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  productImgResize,
  uploadImages
);

router.delete(
  "/delete-image/:id",
  authMiddleware,
  isAdmin,
  deleteImages, // Fonction pour gérer la suppression des images // Cloudinary
);

router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.post("/", authMiddleware, isAdmin, createProduct);



router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

module.exports = router;
