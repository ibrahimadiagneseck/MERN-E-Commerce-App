const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages
} = require("../controller/productCtrl");
const { productImgResize, uploadPhoto } = require("../middlewares/uploadImage"); // Importation des middlewares pour le traitement des images
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();


router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2), // Limite à 2 images
  productImgResize, // Middleware pour redimensionner les images // Redimensionner avant l'upload
  uploadImages, // Fonction pour gérer l'upload des images // Uploader les images vers Cloudinary
);

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

module.exports = router;
