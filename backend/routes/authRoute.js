const express = require("express");

const {
  // Auth
  createUser,
  loginUserCtrl,
  loginAdmin,
  handleRefreshToken,
  logout,
  forgotPasswordToken,
  resetPassword,
  updatePassword,

  // User
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  getWishlist,
  saveAddress,

  // Cart
  userCart,
  getUserCart,
  emptyCart,
  removeProductFromCart,
  updateProductQuantity,

  // Orders
  createOrder,
  getOrders,
  getAllOrders,
  getOrderByUserId,
  getOrderById,
  updateOrderStatus,
} = require("../controller/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

/* ===========================
   AUTHENTICATION (publiques)
=========================== */
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

/* ===========================
   USER MANAGEMENT (routes spécifiques protégées)
=========================== */
router.put("/password", authMiddleware, updatePassword);
router.get("/all-users", authMiddleware, isAdmin, getallUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);

/* ===========================
   CART (routes spécifiques protégées)
=========================== */
router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/remove-product-cart", authMiddleware, removeProductFromCart);
router.put("/update-quantity-cart", authMiddleware, updateProductQuantity);

/* ===========================
   ORDERS (USER) - routes spécifiques protégées
=========================== */
router.post("/order/create", authMiddleware, createOrder);
router.get("/orders/my-orders", authMiddleware, getOrders);
router.get("/order/:orderId", authMiddleware, getOrderById);

/* ===========================
   ORDERS (ADMIN) - routes spécifiques protégées
=========================== */
router.get("/orders/all", authMiddleware, isAdmin, getAllOrders);
router.get("/orders/user/:userId", authMiddleware, isAdmin, getOrderByUserId);
router.put("/order/status/:orderId", authMiddleware, isAdmin, updateOrderStatus);

/* ===========================
   ROUTES DYNAMIQUES (AVEC PARAMÈTRES) - À METTRE EN DERNIER
=========================== */
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", authMiddleware, isAdmin, deleteaUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;