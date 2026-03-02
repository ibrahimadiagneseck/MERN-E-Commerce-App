const express = require("express");

const {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  applyCouponToCart,
  removeCouponFromCart,
} = require("../controller/couponCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

/* ===========================
   COUPONS (ADMIN)
=========================== */

// Créer un coupon
router.post("/", authMiddleware, isAdmin, createCoupon);

// Récupérer tous les coupons (avec filtres / pagination)
router.get("/", authMiddleware, isAdmin, getAllCoupons);

// Récupérer un coupon par ID
router.get("/:id", authMiddleware, isAdmin, getCoupon);

// Mettre à jour un coupon
router.put("/:id", authMiddleware, isAdmin, updateCoupon);

// Supprimer (soft delete) un coupon
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

/* ===========================
   COUPONS (USER / CART)
=========================== */

// Appliquer un coupon au panier
router.post(
  "/apply",
  authMiddleware,
  applyCouponToCart
);

// Retirer le coupon du panier
router.delete(
  "/remove",
  authMiddleware,
  removeCouponFromCart
);

module.exports = router;
 