const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

/**
 * 🏷️ CRÉER UN COUPON
 * POST: /api/coupon
 */
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const { name, discountType, discount, expiry } = req.body;

    // 🔍 Validation des données requises
    if (!name || discount === undefined || !expiry) {
      return res.status(400).json({
        success: false,
        message: "Name, discount and expiry are required fields",
      });
    }

    // 📅 Vérifier la date d'expiration
    const expiryDate = new Date(expiry);
    if (expiryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    // 🔢 Validation du discount selon le type
    if (discountType === "percentage" && (discount < 0 || discount > 100)) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount must be between 0 and 100",
      });
    }

    if (discountType === "fixed_amount" && discount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Fixed amount discount must be greater than 0",
      });
    }

    // 🔍 Vérifier l'unicité
    const existingCoupon = await Coupon.findOne({
      $or: [{ name: name.toUpperCase() }, { code: name.toUpperCase() }],
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon with this name or code already exists",
      });
    }

    // 🏷️ Préparer les données
    const couponData = {
      ...req.body,
      name: name.toUpperCase(),
      createdBy: req.user._id,
    };

    // 💾 Créer le coupon
    const newCoupon = await Coupon.create(couponData);

    // ✅ Réponse
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: newCoupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * 📋 RÉCUPÉRER TOUS LES COUPONS
 * GET: /api/coupon
 */
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "active",
      search = "",
      sort = "-createdAt",
    } = req.query;

    // 🔍 Construire la requête
    const query = { isDeleted: false };

    // 📊 Filtrer par statut
    if (status === "active") {
      query.isActive = true;
      query.expiry = { $gt: new Date() };
    } else if (status === "expired") {
      query.$or = [{ isActive: false }, { expiry: { $lte: new Date() } }];
    }

    // 🔎 Recherche
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 📈 Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🗂️ Exécuter les requêtes
    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "firstname lastname email")
        .lean(),
      Coupon.countDocuments(query),
    ]);

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Coupons retrieved successfully",
      data: {
        coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve coupons",
    });
  }
});

/**
 * 🔄 METTRE À JOUR UN COUPON
 * PUT: /api/coupon/:id
 */
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    validateMongoDbId(id);

    // 🔍 Vérifier l'existence
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // 🚫 Vérifier si supprimé
    if (coupon.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot update a deleted coupon",
      });
    }

    // 🔍 Vérifier l'unicité si modification du nom/code
    if (req.body.name && req.body.name !== coupon.name) {
      const existing = await Coupon.findOne({
        name: req.body.name.toUpperCase(),
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Coupon with this name already exists",
        });
      }
    }

    // 💾 Mettre à jour
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { ...req.body, ...(req.body.name && { name: req.body.name.toUpperCase() }) },
      { new: true, runValidators: true }
    );

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update coupon",
    });
  }
});

/**
 * 🗑️ SUPPRIMER UN COUPON
 * DELETE: /api/coupon/:id
 */
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    validateMongoDbId(id);

    // 🔍 Vérifier l'existence
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // 🚫 Vérifier si déjà supprimé
    if (coupon.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Coupon already deleted",
      });
    }

    // 🔄 Soft delete (changer le statut)
    coupon.isActive = false;
    coupon.isDeleted = true;
    await coupon.save();

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
    });
  }
});

/**
 * 📄 RÉCUPÉRER UN COUPON
 * GET: /api/coupon/:id
 */
const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    validateMongoDbId(id);

    // 🔍 Récupérer le coupon
    const coupon = await Coupon.findById(id)
      .populate("createdBy", "firstname lastname email");

    if (!coupon || coupon.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Coupon retrieved successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve coupon",
    });
  }
});

/**
 * 🎯 VALIDER ET APPLIQUER UN COUPON AU PANIER
 * POST: /api/coupon/apply
 */
const applyCouponToCart = asyncHandler(async (req, res) => {
  try {
    const { couponCode } = req.body;
    const { _id: userId } = req.user;

    // 🔍 Validation
    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    validateMongoDbId(userId);

    // 👤 Récupérer l'utilisateur et son panier
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🛒 Vérifier si le panier est vide
    if (!user.cart || user.cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // 🏷️ Chercher le coupon
    const coupon = await Coupon.findOne({
      $or: [{ name: couponCode.toUpperCase() }, { code: couponCode.toUpperCase() }],
      isActive: true,
      isDeleted: false,
      expiry: { $gt: new Date() },
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    // 🔢 Vérifier les limites d'utilisation
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached",
      });
    }

    // 👥 Vérifier les restrictions utilisateur
    if (coupon.userRestriction === "new_users") {
      const userOrderCount = await Order.countDocuments({ orderby: userId });
      if (userOrderCount > 0) {
        return res.status(400).json({
          success: false,
          message: "Coupon reserved for new customers only",
        });
      }
    }

    if (coupon.userRestriction === "specific_users" && 
        !coupon.allowedUsers.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "This coupon is not available for your account",
      });
    }

    if (coupon.excludedUsers.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "This coupon is not available for your account",
      });
    }

    // 📊 Vérifier le montant minimum du panier
    if (user.cart.cartTotal < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${coupon.minimumAmount} required for this coupon`,
      });
    }

    // 💰 Appliquer le coupon
    let discountAmount = 0;
    let freeShipping = false;

    switch (coupon.discountType) {
      case "percentage":
        discountAmount = (user.cart.cartTotal * coupon.discount) / 100;
        if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
          discountAmount = coupon.maximumDiscount;
        }
        break;

      case "fixed_amount":
        discountAmount = Math.min(coupon.discount, user.cart.cartTotal);
        break;

      case "free_shipping":
        freeShipping = true;
        discountAmount = 0; // La réduction s'applique aux frais de livraison
        break;
    }

    // 🔢 Calculer le total après réduction
    const totalAfterDiscount = Math.max(0, user.cart.cartTotal - discountAmount);

    // 💾 Mettre à jour le panier de l'utilisateur
    user.cart.totalAfterDiscount = totalAfterDiscount;
    user.cart.couponApplied = {
      couponId: coupon._id,
      code: coupon.code || coupon.name,
      discountAmount,
      discountType: coupon.discountType,
      freeShipping,
    };

    await user.save();

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        discountAmount,
        cartTotal: user.cart.cartTotal,
        totalAfterDiscount,
        freeShipping,
        coupon: {
          name: coupon.name,
          code: coupon.code,
          discountType: coupon.discountType,
          discount: coupon.discount,
        },
      },
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * ❌ RETIRER UN COUPON DU PANIER
 * DELETE: /api/coupon/remove
 */
const removeCouponFromCart = asyncHandler(async (req, res) => {
  try {
    const { _id: userId } = req.user;
    validateMongoDbId(userId);

    // 👤 Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔄 Réinitialiser les valeurs du coupon dans le panier
    user.cart.totalAfterDiscount = 0;
    user.cart.couponApplied = undefined;

    await user.save();

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      data: {
        cartTotal: user.cart.cartTotal,
      },
    });
  } catch (error) {
    console.error("Remove coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove coupon",
    });
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  applyCouponToCart,
  removeCouponFromCart,
};
