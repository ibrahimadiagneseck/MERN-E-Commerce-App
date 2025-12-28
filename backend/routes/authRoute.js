const express = require("express");

const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  removeProductFromCart,
  updateProductQuantity,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controller/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Authentication routes
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);

// Cart routes
router.post("/cart", authMiddleware, userCart); // Ajouter au panier
router.get("/cart", authMiddleware, getUserCart); // Récupérer le panier
router.delete("/empty-cart", authMiddleware, emptyCart); // Vider le panier
router.delete("/remove-product-cart", authMiddleware, removeProductFromCart); // Supprimer un produit
router.put("/update-quantity-cart", authMiddleware, updateProductQuantity); // Mettre à jour la quantité

// Coupon and order routes
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

// User management routes
router.get("/all-users", getallUser);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getAllOrders);

// Other routes
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", deleteaUser);

router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;