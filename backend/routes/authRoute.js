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
   AUTHENTICATION
=========================== */
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);

/* ===========================
   USER MANAGEMENT
=========================== */
router.get("/all-users", authMiddleware, isAdmin, getallUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", authMiddleware, isAdmin, deleteaUser);

router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

/* ===========================
   CART
=========================== */
router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/remove-product-cart", authMiddleware, removeProductFromCart);
router.put("/update-quantity-cart", authMiddleware, updateProductQuantity);

/* ===========================
   ORDERS (USER)
=========================== */
router.post("/order/create", authMiddleware, createOrder);
router.get("/orders/my-orders", authMiddleware, getOrders);
router.get("/order/:orderId", authMiddleware, getOrderById);

/* ===========================
   ORDERS (ADMIN)
=========================== */
router.get("/orders/all", authMiddleware, isAdmin, getAllOrders);
router.get(
  "/orders/user/:userId",
  authMiddleware,
  isAdmin,
  getOrderByUserId
);
router.put(
  "/order/status/:orderId",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);



module.exports = router;

