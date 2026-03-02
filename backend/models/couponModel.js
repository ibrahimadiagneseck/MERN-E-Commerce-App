const mongoose = require("mongoose");

// const coupon = await Coupon.create({
//   name: "BLACKFRIDAY2024",
//   description: "Black Friday Special - 30% off",
//   discountType: "percentage",
//   discount: 30,
//   minimumAmount: 100,
//   maximumDiscount: 50,
//   startDate: new Date("2024-11-25"),
//   expiry: new Date("2024-11-30"),
//   usageLimit: 1000,
//   couponType: "seasonal",
//   createdBy: adminUserId,
// });

// Déclarer le schéma du modèle de coupon
var couponSchema = new mongoose.Schema(
  {
    // 🔤 NOM DU COUPON
    name: {
      type: String,
      required: [true, "Le nom du coupon est requis"], // Message d'erreur personnalisé
      unique: true,               // Garantit l'unicité dans la base
      uppercase: true,            // Convertit automatiquement en majuscules
      trim: true,                 // Supprime les espaces avant/après
      minlength: [3, "Le nom doit contenir au moins 3 caractères"],
      maxlength: [20, "Le nom ne peut dépasser 20 caractères"],
      match: [/^[A-Z0-9_-]+$/, "Seuls lettres, chiffres, _ et - sont autorisés"],
      index: true,                // Index pour recherche rapide
    },
    
    // 🔤 CODE DU COUPON (alias)
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      sparse: true,               // Permet null/undefined pour unicité
    },
    
    // 📝 DESCRIPTION
    description: {
      type: String,
      trim: true,
      maxlength: [200, "La description ne peut dépasser 200 caractères"],
    },
    
    // 💰 TYPES DE RÉDUCTION
    discountType: {
      type: String,
      enum: {
        values: ["percentage", "fixed_amount", "free_shipping"],
        message: "Le type doit être: percentage, fixed_amount ou free_shipping",
      },
      default: "percentage",
      required: true,
    },
    
    // 💵 VALEUR DE LA RÉDUCTION
    discount: {
      type: Number,
      required: [true, "Le montant de la réduction est requis"],
      min: [0, "La réduction ne peut être négative"],
      validate: {
        validator: function(value) {
          // Validation selon le type de réduction
          if (this.discountType === "percentage") {
            return value >= 0 && value <= 100; // 0-100%
          }
          return value >= 0; // Montant fixe positif
        },
        message: "Pourcentage: 0-100% | Montant fixe: positif",
      },
    },
    
    // 💰 MONTANT MINIMUM DE COMMANDE
    minimumAmount: {
      type: Number,
      min: [0, "Le montant minimum ne peut être négatif"],
      default: 0,
    },
    
    // 💰 MONTANT MAXIMUM DE RÉDUCTION
    maximumDiscount: {
      type: Number,
      min: [0, "Le maximum de réduction ne peut être négatif"],
      default: null, // null = pas de limite
    },
    
    // 📅 DATES DE VALIDITÉ
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiry: {
      type: Date,
      required: [true, "La date d'expiration est requise"],
      validate: {
        validator: function(value) {
          return value > this.startDate; // Expiration après début
        },
        message: "La date d'expiration doit être après la date de début",
      },
    },
    
    // 🔢 LIMITES D'UTILISATION
    usageLimit: {
      type: Number,
      min: [1, "La limite doit être au moins 1"],
      default: null, // null = pas de limite
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, "Le compteur ne peut être négatif"],
    },
    perUserLimit: {
      type: Number,
      min: [1, "La limite par utilisateur doit être au moins 1"],
      default: 1,
    },
    
    // 🎯 CONDITIONS D'APPLICATION
    applicableCategories: [{
      type: String,
      trim: true,
    }],
    applicableProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    excludedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    
    // 👥 RESTRICTIONS UTILISATEURS
    userRestriction: {
      type: String,
      enum: ["all", "new_users", "existing_users", "specific_users"],
      default: "all",
    },
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    excludedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    
    // 🏷️ TYPE DE COUPON
    couponType: {
      type: String,
      enum: ["public", "private", "promotional", "seasonal", "referral"],
      default: "public",
    },
    
    // 📱 SOURCE/ORIGINE
    source: {
      type: String,
      enum: ["admin", "newsletter", "social_media", "referral_program", "event"],
      default: "admin",
    },
    
    // 🏢 ASSOCIATION AVEC ORDERS
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    }],
    
    // 📊 STATISTIQUES
    totalDiscountGiven: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // ✅ ÉTAT DU COUPON
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Pour filtrer rapidement les coupons actifs
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Exclu des requêtes par défaut
    },
    
    // 👤 CRÉATEUR
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🧮 CHAMP VIRTUEL - Vérifie si le coupon est valide
couponSchema.virtual("isValid").get(function() {
  const now = new Date();
  return (
    this.isActive &&
    !this.isDeleted &&
    now >= this.startDate &&
    now <= this.expiry &&
    (!this.usageLimit || this.usageCount < this.usageLimit)
  );
});

// 🧮 CHAMP VIRTUEL - Jours restants
couponSchema.virtual("daysRemaining").get(function() {
  const now = new Date();
  const expiry = new Date(this.expiry);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// 🧮 CHAMP VIRTUEL - Taux d'utilisation
couponSchema.virtual("usageRate").get(function() {
  if (!this.usageLimit) return 0;
  return (this.usageCount / this.usageLimit) * 100;
});

// 🔧 MIDDLEWARE - Génération automatique du code
couponSchema.pre("save", function(next) {
  // Si pas de code fourni, générer à partir du nom
  if (!this.code && this.name) {
    this.code = this.name;
  }
  next();
});

// 🔧 MIDDLEWARE - Validation avant sauvegarde
couponSchema.pre("save", function(next) {
  // S'assurer que la date de début est avant l'expiration
  if (this.startDate >= this.expiry) {
    next(new Error("La date de début doit être avant la date d'expiration"));
  }
  
  // S'assurer que maximumDiscount est cohérent
  if (this.maximumDiscount && this.discountType === "percentage") {
    // Pourcentage: maximumDiscount est le montant max, pas un pourcentage
  }
  next();
});

// 🔍 INDEXES COMPOSÉS POUR PERFORMANCE
couponSchema.index({ isActive: 1, expiry: 1 }); // Pour trouver coupons actifs non expirés
couponSchema.index({ code: 1, isActive: 1 }); // Pour validation rapide
couponSchema.index({ createdBy: 1, createdAt: -1 }); // Pour l'admin
couponSchema.index({ couponType: 1, isActive: 1 }); // Pour filtrage par type

// 📊 MÉTHODES D'INSTANCE

// Méthode pour appliquer le coupon
couponSchema.methods.applyCoupon = function(cartTotal, userId = null) {
  if (!this.isValid) {
    throw new Error("Coupon invalide ou expiré");
  }
  
  if (cartTotal < this.minimumAmount) {
    throw new Error(`Montant minimum requis: ${this.minimumAmount}`);
  }
  
  let discountAmount = 0;
  
  switch (this.discountType) {
    case "percentage":
      discountAmount = (cartTotal * this.discount) / 100;
      break;
    case "fixed_amount":
      discountAmount = this.discount;
      break;
    case "free_shipping":
      discountAmount = 0; // Géré séparément
      break;
  }
  
  // Appliquer le maximum de réduction si défini
  if (this.maximumDiscount && discountAmount > this.maximumDiscount) {
    discountAmount = this.maximumDiscount;
  }
  
  // Ne pas donner plus de réduction que le montant du panier
  if (discountAmount > cartTotal) {
    discountAmount = cartTotal;
  }
  
  return {
    discountAmount,
    finalAmount: cartTotal - discountAmount,
    freeShipping: this.discountType === "free_shipping",
    coupon: this,
  };
};

// Méthode pour incrémenter l'utilisation
couponSchema.methods.incrementUsage = async function(orderId, userId) {
  this.usageCount += 1;
  this.orders.push(orderId);
  await this.save();
};

// 📤 EXPORT DU MODÈLE
module.exports = mongoose.model("Coupon", couponSchema);