const mongoose = require("mongoose");

// Déclarer le schéma du modèle de commande
var orderSchema = new mongoose.Schema(
  {
    // 🔢 NUMÉRO DE COMMANDE - Unique et lisible
    orderNumber: {
      type: String,
      unique: true,        // Garantit l'unicité
      required: true,
      index: true,         // Améliore les performances de recherche
    },
    // 📦 PRODUITS COMMANDÉS - Tableau des articles
    products: [
      {
        product: {        // ✅ Référence au produit original
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Référence au modèle Product
          required: true,
        },
        name: {          // 📝 Nom du produit au moment de l'achat
          type: String,
          required: true,
        },
        count: {         // 🔢 Quantité commandée
          type: Number,
          required: true,
          min: 1,        // Minimum 1 unité
        },
        color: {         // 🎨 Couleur choisie (si applicable)
          type: String,
        },
        price: {         // 💰 Prix unitaire au moment de l'achat
          type: Number,
          required: true,
          min: 0,        // Prix ne peut pas être négatif
        },
        // 💡 Pourquoi stocker le prix ? 
        // → Garantit l'intégrité historique même si le prix du produit change
      },
    ],
    
    // 💰 MONTANTS FINANCIERS
    subtotal: {          // 💵 Total avant taxes et frais
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {       // 🚚 Frais de livraison
      type: Number,
      default: 0,
      min: 0,
    },
    taxAmount: {         // 🏛️ Montant des taxes
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {    // 🏷️ Réduction appliquée
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {       // 💰 Montant final à payer
      type: Number,
      required: true,
      min: 0,
    },
    
    // 💳 INFORMATIONS DE PAIEMENT
    paymentMethod: {     // 🏦 Méthode de paiement
      type: String,
      enum: [            // ✅ Valeurs autorisées
        "credit_card",   // Carte bancaire
        "debit_card",    // Carte de débit
        "paypal",        // PayPal
        "stripe",        // Stripe
        "cash_on_delivery", // Paiement à la livraison
        "bank_transfer", // Virement bancaire
      ],
      required: true,
    },
    paymentStatus: {     // ✅ État du paiement
      type: String,
      enum: [
        "pending",       // En attente
        "processing",    // En traitement
        "completed",     // Terminé
        "failed",        // Échoué
        "refunded",      // Remboursé
        "partially_refunded", // Partiellement remboursé
      ],
      default: "pending",
    },
    paymentIntent: {     // 🔐 Données du prestataire de paiement
      type: mongoose.Schema.Types.Mixed, // Type flexible
      default: {},
    },
    
    // 📦 STATUT DE LA COMMANDE
    orderStatus: {       // 🚚 État de la commande
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",   // Non traitée
        "Processing",      // En traitement
        "Confirmed",       // Confirmée
        "Dispatched",      // Expédiée
        "Shipped",         // Envoyée
        "Out for Delivery",// En livraison
        "Delivered",       // Livrée
        "Cancelled",       // Annulée
        "Returned",        // Retournée
        "Refunded",        // Remboursée
      ],
    },
    
    // 📍 ADRESSE DE LIVRAISON
    shippingAddress: {
      fullName: {       // 👤 Nom complet du destinataire
        type: String,
        required: true,
      },
      street: {         // #️⃣ Rue et numéro
        type: String,
        required: true,
      },
      apartment: {      // 🏢 Appartement/Bureau (optionnel)
        type: String,
      },
      city: {           // 🏙️ Ville
        type: String,
        required: true,
      },
      state: {          // 🗺️ Région/État
        type: String,
        required: true,
      },
      country: {        // 🌍 Pays
        type: String,
        required: true,
      },
      postalCode: {     // 📮 Code postal
        type: String,
        required: true,
      },
      phone: {          // 📱 Téléphone
        type: String,
        required: true,
      },
      email: {          // 📧 Email (pour notifications)
        type: String,
        required: true,
      },
    },
    
    // 📦 INFORMATIONS DE LIVRAISON
    shippingMethod: {    // 🚚 Méthode de livraison
      type: String,
      enum: [
        "standard",     // Standard (3-5 jours)
        "express",      // Express (1-2 jours)
        "next_day",     // Livraison le lendemain
        "store_pickup", // Retrait en magasin
      ],
      default: "standard",
    },
    trackingNumber: {    // #️⃣ Numéro de suivi
      type: String,
    },
    carrier: {          // 🚚 Transporteur
      type: String,
      enum: ["ups", "fedex", "dhl", "postal", "other"],
    },
    
    // 👤 CLIENT
    orderby: {          // 👤 Référence à l'utilisateur
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",      // Référence au modèle User
      required: true,
    },
    
    // 📝 NOTES ET INFORMATIONS
    customerNotes: {    // 📝 Notes du client
      type: String,
      maxlength: 500,   // Limite de caractères
    },
    adminNotes: {       //   🔧 Notes internes (admin)
      type: String,
      maxlength: 500,
    },
    
    // 🏷️ COUPON UTILISÉ
    couponUsed: {
      code: String,     // 🏷️ Code du coupon
      discountType: {   // 💰 Type de réduction
        type: String,
        enum: ["percentage", "fixed_amount"],
      },
      discountValue: Number, // Valeur de la réduction
    },
    
    // 📊 MÉTADONNÉES
    ipAddress: String,  // 🌐 Adresse IP du client
    userAgent: String,  // 🖥️ Navigateur/Appareil utilisé
    source: {           // 📱 Source de la commande
      type: String,
      enum: ["web", "mobile_app", "admin_panel"],
      default: "web",
    },
  },
  {
    timestamps: true,   // ⏰ Ajoute createdAt et updatedAt automatiquement
    toJSON: { virtuals: true }, // Inclut les champs virtuels dans JSON
    toObject: { virtuals: true },
  }
);

// 🔧 MIDDLEWARE - Génération automatique du numéro de commande
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `ORD-${year}${month}-${randomNum}`;
  }
  next();
});

// 🧮 CHAMP VIRTUEL - Calcul du nombre total d'articles
orderSchema.virtual("totalItems").get(function () {
  return this.products.reduce((total, item) => total + item.count, 0);
});

// 🔍 INDEXES - Optimisation des recherches
// orderSchema.index({ orderNumber: 1 }); // Recherche par numéro
orderSchema.index({ orderby: 1, createdAt: -1 }); // Commandes par utilisateur
orderSchema.index({ orderStatus: 1 }); // Filtrage par statut
orderSchema.index({ "paymentIntent.id": 1 }); // Recherche paiement
orderSchema.index({ createdAt: -1 }); // Tri par date récente

// 📤 EXPORT DU MODÈLE
module.exports = mongoose.model("Order", orderSchema);