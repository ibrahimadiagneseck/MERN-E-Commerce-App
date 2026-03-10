const User = require("../models/userModel");
const Product = require("../models/productModel");
// const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const { log } = require("console");


// Create a User ----------------------------------------------
const createUser = asyncHandler(async (req, res) => {
  try {
    // TODO: Get the email from req.body
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // TODO: Find if the user exists with the provided email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // TODO: If user found, throw an error: User already exists
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // TODO: If user not found, create a new user
    const newUser = await User.create(req.body);

    res.json(newUser);

    // Send success response with the newly created user
    // res.status(201).json({
    //   success: true,
    //   message: "User created successfully",
    //   data: newUser,
    // });
  } catch (error) {
    // Catch and handle any errors during user creation process
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});



// Connexion d'un utilisateur
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Vérifier si l'utilisateur existe
  const findUser = await User.findOne({ email });
  
  if (!findUser) {
    throw new Error("Utilisateur non trouvé");
  }
  
  // Vérifier si l'utilisateur est bloqué
  if (findUser.isBlocked) {
    throw new Error("Votre compte a été bloqué. Veuillez contacter l'administrateur.");
  }
  
  // Vérifier le mot de passe
  if (await findUser.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findUser?._id);

    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Mot de passe incorrect");
  }
});

// admin login
// Connexion administrateur
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe
  const findAdmin = await User.findOne({ email });

  // Ajouter une vérification d'existence de l'utilisateur
  if (!findAdmin) {
    throw new Error("Utilisateur non trouvé");
  }

  // Maintenant vérifier le rôle
  if (findAdmin.role !== "admin") {
    throw new Error("Non autorisé");
  }

  if (await findAdmin.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);

    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Identifiants invalides");
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {

  const cookie = req.cookies;

  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // Vérifie si le cookie contient le refreshToken
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  // Recherche l'utilisateur avec le refreshToken
  const user = await User.findOne({ refreshToken });
  // Si aucun utilisateur n'est trouvé, on nettoie le cookie et on retourne un statut 204
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, // pour HTTPS, à enlever pour développement local
    });
    return res.sendStatus(204); // No Content
  }
  // Mise à jour de l'utilisateur en retirant le refreshToken
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  // Nettoie le cookie contenant le refreshToken
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true, // pour HTTPS, à enlever pour développement local
  });
  res.sendStatus(204); // No Content
});


// Update a user
const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// save user Address
const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    // res.json(blockusr);
    res.json({
      message: "User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  // Récupère le mot de passe dans le corps de la requête
  const { password } = req.body;

  // Récupère le token de réinitialisation depuis les paramètres de l'URL
  const { token } = req.params;

  // Hache le token récupéré en utilisant l'algorithme SHA-256
  // Cela permet de comparer ce token haché avec celui stocké dans la base de données
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Cherche l'utilisateur dans la base de données avec le token haché
  // et vérifie si le token n'a pas expiré (passwordResetExpires doit être supérieur à la date actuelle)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Si la date d'expiration est dépassée, le token n'est plus valide
  });

  // Si aucun utilisateur n'est trouvé (soit à cause du token invalide ou expiré), une erreur est levée
  if (!user) throw new Error("Token Expired, Please try again later");

  // Si un utilisateur est trouvé, le mot de passe de l'utilisateur est mis à jour avec le nouveau mot de passe fourni
  user.password = password;

  // On efface le token et la date d'expiration de réinitialisation du mot de passe
  // car ils ne sont plus nécessaires une fois le mot de passe réinitialisé
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Sauvegarde l'utilisateur avec le nouveau mot de passe dans la base de données
  await user.save();

  // Renvoie une réponse JSON contenant les informations de l'utilisateur
  res.json(user);
});


const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});


const userCart = asyncHandler(async (req, res) => {
  // console.log("\n========== 🛒 AJOUT AU PANIER ==========");
  // console.log("📅 Timestamp:", new Date().toISOString());
  
  const { productId, color, quantity } = req.body;
  const { _id } = req.user;

  // Log des données reçues
  // console.log("📦 Données reçues:");
  // console.log("   - User ID:", _id);
  // console.log("   - Product ID:", productId);
  // console.log("   - Color:", color);
  // console.log("   - Quantity:", quantity);

  try {
    // Validation des champs requis
    // console.log("\n🔍 Étape 1: Validation des champs");
    if (!productId || !color || !quantity) {
      // console.log("❌ Validation échouée - Champs manquants");
      // console.log("   productId:", productId ? "✅" : "❌");
      // console.log("   color:", color ? "✅" : "❌");
      // console.log("   quantity:", quantity ? "✅" : "❌");
      
      return res.status(400).json({
        success: false,
        message: "productId, color and quantity are required"
      });
    }
    // console.log("✅ Validation des champs OK");

    // Valider les IDs
    // console.log("\n🔍 Étape 2: Validation des IDs MongoDB");
    // console.log("   Validation User ID:", _id);
    validateMongoDbId(_id);
    // console.log("   ✅ User ID valide");
    
    // console.log("   Validation Product ID:", productId);
    validateMongoDbId(productId);
    // console.log("   ✅ Product ID valide");

    // Fonction pour arrondir à 2 décimales
    const roundToTwoDecimals = (num) => {
      return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
    };

    // Trouver l'utilisateur
    // console.log("\n🔍 Étape 3: Recherche de l'utilisateur");
    const user = await User.findById(_id);
    if (!user) {
      // console.log("❌ Utilisateur non trouvé - ID:", _id);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    // console.log("✅ Utilisateur trouvé:", user.email);
    // console.log("   Rôle:", user.role);
    // console.log("   Bloqué:", user.isBlocked);

    // Initialiser le panier si nécessaire
    // console.log("\n🔍 Étape 4: Vérification/Initialisation du panier");
    if (!user.cart) {
      // console.log("   ⚠️ Panier inexistant - Création d'un nouveau panier");
      user.cart = {
        products: [],
        cartTotal: 0,
        totalAfterDiscount: 0
      };
    } else {
      // console.log("   ✅ Panier existant");
      // console.log("   Nombre de produits actuel:", user.cart.products?.length || 0);
      // console.log("   Total actuel:", user.cart.cartTotal);
    }

    // S'assurer que products est un tableau
    if (!Array.isArray(user.cart.products)) {
      // console.log("   ⚠️ Products n'est pas un tableau - Réinitialisation");
      user.cart.products = [];
    }

    // Trouver le produit
    // console.log("\n🔍 Étape 5: Recherche du produit");
    const product = await Product.findById(productId).select("price title quantity").exec();
    if (!product) {
      // console.log("❌ Produit non trouvé - ID:", productId);
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    // console.log("✅ Produit trouvé:", product.title);
    // console.log("   Prix:", product.price);
    // console.log("   Stock disponible:", product.quantity);

    // Valider le stock
    const validatedQuantity = parseInt(quantity) || 1;
    // console.log("\n🔍 Étape 6: Validation du stock");
    // console.log("   Quantité demandée:", validatedQuantity);
    // console.log("   Stock disponible:", product.quantity);
    
    if (validatedQuantity > product.quantity) {
      // console.log("❌ Stock insuffisant - Demandé:", validatedQuantity, "Disponible:", product.quantity);
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.quantity}`
      });
    }
    // console.log("✅ Stock suffisant");

    // Valider et arrondir le prix du produit
    const productPrice = roundToTwoDecimals(product.price);
    // console.log("\n💰 Calculs financiers:");
    // console.log("   Prix unitaire (arrondi):", productPrice);
    // console.log("   Quantité:", validatedQuantity);

    // Calculer le subtotal pour ce produit
    const subtotal = roundToTwoDecimals(productPrice * validatedQuantity);
    // console.log("   Subtotal calculé:", subtotal);

    // Vérifier si le produit existe déjà dans le panier
    // console.log("\n🔍 Étape 7: Vérification de l'existence dans le panier");
    // console.log("   Recherche produit avec color:", color);
    
    const existingProductIndex = user.cart.products.findIndex(
      item => {
        const itemProductId = item.product._id ? 
          item.product._id.toString() : 
          item.product.toString();
        return itemProductId === productId && item.color === color;
      }
    );
    
    if (existingProductIndex > -1) {
      // Mettre à jour le produit existant
      // console.log("   ✅ Produit existant trouvé à l'index:", existingProductIndex);
      // console.log("   Ancienne quantité:", user.cart.products[existingProductIndex].count);
      // console.log("   Ancien subtotal:", user.cart.products[existingProductIndex].subtotal);
      
      user.cart.products[existingProductIndex].count += validatedQuantity;
      user.cart.products[existingProductIndex].price = productPrice;
      user.cart.products[existingProductIndex].subtotal = roundToTwoDecimals(
        user.cart.products[existingProductIndex].price * user.cart.products[existingProductIndex].count
      );
      
      // console.log("   Nouvelle quantité:", user.cart.products[existingProductIndex].count);
      // console.log("   Nouveau subtotal:", user.cart.products[existingProductIndex].subtotal);
    } else {
      // Ajouter un nouveau produit
      // console.log("   ➕ Nouveau produit - Ajout au panier");
      const newProduct = {
        product: productId,
        count: validatedQuantity,
        color: color,
        price: productPrice,
        subtotal: subtotal
      };
      // console.log("   Détails du nouveau produit:", newProduct);
      
      user.cart.products.push(newProduct);
    }

    // Fonction pour calculer le total du panier
    const calculateCartTotal = (products) => {
      const total = products.reduce((sum, item) => {
        return sum + roundToTwoDecimals(item.subtotal || 0);
      }, 0);
      return roundToTwoDecimals(total);
    };

    // Mettre à jour les totaux
    // console.log("\n📊 Étape 8: Mise à jour des totaux");
    const previousCartTotal = user.cart.cartTotal;
    user.cart.cartTotal = calculateCartTotal(user.cart.products);
    user.cart.totalAfterDiscount = user.cart.cartTotal;
    
    // console.log("   Ancien total:", previousCartTotal);
    // console.log("   Nouveau total:", user.cart.cartTotal);
    // console.log("   Différence:", user.cart.cartTotal - previousCartTotal);
    
    // Sauvegarder les modifications
    // console.log("\n💾 Étape 9: Sauvegarde en base de données");
    await user.save();
    // console.log("✅ Sauvegarde réussie");

    // Préparer la réponse avec les données peuplées
    // console.log("\n🔍 Étape 10: Peuplement des données produit");
    const populatedUser = await User.findById(_id)
      .populate("cart.products.product", "title price images quantity category brand")
      .select("cart");
    
    // console.log("✅ Peuplement terminé");

    // Formater les données de la réponse
    const formatCartResponse = (cart) => {
      if (!cart) return null;
      
      const formattedCart = {
        ...cart.toObject(),
        cartTotal: roundToTwoDecimals(cart.cartTotal),
        totalAfterDiscount: roundToTwoDecimals(cart.totalAfterDiscount)
      };

      if (Array.isArray(cart.products)) {
        formattedCart.products = cart.products.map(item => {
          const itemPrice = roundToTwoDecimals(item.price);
          const itemCount = parseInt(item.count) || 0;
          const itemSubtotal = item.subtotal ? roundToTwoDecimals(item.subtotal) : roundToTwoDecimals(itemPrice * itemCount);
          
          return {
            ...item.toObject ? item.toObject() : item,
            price: itemPrice,
            count: itemCount,
            subtotal: itemSubtotal
          };
        });
      }

      return formattedCart;
    };

    const formattedCart = formatCartResponse(populatedUser.cart);
    
    // console.log("\n✅ Opération réussie!");
    // console.log("   Nombre de produits dans le panier:", formattedCart.products.length);
    // console.log("   Total du panier:", formattedCart.cartTotal);
    // console.log("==========================================\n");
    
    res.json({
      success: true,
      message: "Product added to cart successfully",
      cart: formattedCart
    });

  } catch (error) {
    // console.error("\n❌ ERREUR dans userCart:");
    // console.error("   Message:", error.message);
    // console.error("   Stack:", error.stack);
    
    // Gérer les erreurs de validation MongoDB
    if (error.message.includes("not valid")) {
      // console.log("   Type: Erreur de validation MongoDB");
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // console.error("   Type: Erreur interne");
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
});


const getUserCart = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    // console.log("\n========== 🛒 RÉCUPÉRATION DU PANIER ==========");
    // console.log("📅 Timestamp:", new Date().toISOString());
    // console.log("👤 User ID:", _id);

    if (!_id) {
      // console.log("❌ Utilisateur non authentifié");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    validateMongoDbId(_id);

    // console.log("🔍 Recherche de l'utilisateur avec population...");
    const user = await User.findById(_id)
      .populate("cart.products.product", "title price images quantity category brand");

    if (!user) {
      // console.log("❌ Utilisateur non trouvé");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // console.log("✅ Utilisateur trouvé:", user.email);
    // console.log("📦 Structure du panier brute:", JSON.stringify(user.cart, null, 2));

    // Vérifier si le panier existe et contient des produits
    if (!user.cart || !user.cart.products || user.cart.products.length === 0) {
      // console.log("📭 Panier vide");
      const emptyCart = {
        products: [],
        cartTotal: 0,
        totalAfterDiscount: 0
      };
      
      // 👇 IMPORTANT: Renvoyer l'objet directement, pas dans une propriété "cart"
      // console.log("✅ Réponse avec panier vide:", emptyCart);
      return res.json(emptyCart);
    }

    // Fonction d'arrondi à 2 décimales
    const roundToTwoDecimals = (num) =>
      Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;

    // console.log("🔄 Recalcul des sous-totaux...");
    const products = user.cart.products.map((item, index) => {
      const price = roundToTwoDecimals(item.price || 0);
      const count = parseInt(item.count) || 0;
      const subtotal = item.subtotal
        ? roundToTwoDecimals(item.subtotal)
        : roundToTwoDecimals(price * count);
      
      const formattedItem = {
        ...item.toObject ? item.toObject() : item,
        price,
        count,
        subtotal
      };
      
      // console.log(`   Produit ${index + 1}:`, {
      //   product: formattedItem.product?.title || item.product,
      //   count,
      //   price,
      //   subtotal
      // });
      
      return formattedItem;
    });

    const cartTotal = roundToTwoDecimals(
      products.reduce((sum, item) => sum + item.subtotal, 0)
    );

    const totalAfterDiscount = cartTotal; // À modifier si vous avez des coupons

    const cart = {
      products,
      cartTotal,
      totalAfterDiscount
    };

    // console.log("📊 Total du panier recalculé:", cartTotal);
    // console.log("✅ Envoi de la réponse au frontend");
    // console.log("==========================================\n");

    // 👇 Renvoyer l'objet cart DIRECTEMENT
    res.json(cart);
    
  } catch (error) {
    // console.error("❌ Error in getUserCart:", error);
    // console.error("   Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Fonction pour vider le panier
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $set: { 
          cart: {
            products: [],
            cartTotal: 0,
            totalAfterDiscount: 0
          }
        }
      },
      { new: true }
    );
    
    res.json(user.cart);
  } catch (error) {
    throw new Error(error);
  }
});

// Fonction pour supprimer un produit du panier
const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, color } = req.body;
  
  validateMongoDbId(_id);
  validateMongoDbId(productId);

  try {
    const user = await User.findById(_id);
    
    if (!user.cart || !user.cart.products) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Fonction pour arrondir à 2 décimales
    const roundToTwoDecimals = (num) => {
      return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
    };
    
    // Filtrer les produits pour retirer celui spécifié
    user.cart.products = user.cart.products.filter(
      item => !(item.product.toString() === productId && item.color === color)
    );
    
    // Recalculer le total du panier
    user.cart.cartTotal = user.cart.products.reduce((total, item) => {
      return total + roundToTwoDecimals(item.subtotal || 0);
    }, 0);
    
    user.cart.totalAfterDiscount = user.cart.cartTotal;
    
    await user.save();
    
    res.json(user.cart);
    
  } catch (error) {
    throw new Error(error);
  }
});


// Fonction pour mettre à jour la quantité
const updateProductQuantity = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, color, newQuantity } = req.body;
  
  validateMongoDbId(_id);
  validateMongoDbId(productId);

  try {
    const user = await User.findById(_id);
    
    if (!user.cart || !user.cart.products) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    
    // Trouver le produit
    const productIndex = user.cart.products.findIndex(
      item => item.product.toString() === productId && item.color === color
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Fonction pour arrondir à 2 décimales
    const roundToTwoDecimals = (num) => {
      return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
    };
    
    // Mettre à jour la quantité et recalculer le subtotal
    user.cart.products[productIndex].count = Number(newQuantity);
    user.cart.products[productIndex].subtotal = roundToTwoDecimals(
      user.cart.products[productIndex].price * user.cart.products[productIndex].count
    );

    // console.log(user.cart);
    
    
    // Recalculer le total du panier
    user.cart.cartTotal = user.cart.products.reduce((total, item) => {
      return total + roundToTwoDecimals(item.subtotal || 0);
    }, 0);
    
    user.cart.totalAfterDiscount = user.cart.cartTotal;
    
    await user.save();
    
    res.json(user.cart);
    
  } catch (error) {
    throw new Error(error);
  }
});



/**
 * 🛒 CRÉER UNE COMMANDE À PARTIR DU PANIER UTILISATEUR
 * POST: /api/order/create
 */
const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "cash_on_delivery",
      customerNotes = "",
    } = req.body;

    const { _id: userId } = req.user;
    validateMongoDbId(userId);

    // 👤 Récupérer l'utilisateur avec son panier
    const user = await User.findById(userId)
      .populate({
        path: "cart.products.product",
        select: "title price quantity images",
      });

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

    // 📊 Préparer les produits pour la commande
    const orderProducts = [];
    let subtotal = 0;
    const stockUpdates = [];

    for (const cartItem of user.cart.products) {
      const product = cartItem.product;
      
      // 🔍 Vérifier la disponibilité du stock
      if (product.quantity < cartItem.count) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Available: ${product.quantity}`,
          productId: product._id,
        });
      }

      // 💰 Calculer le sous-total pour cet article
      const itemSubtotal = cartItem.price * cartItem.count;
      subtotal += itemSubtotal;

      // 📦 Préparer l'article pour la commande
      orderProducts.push({
        product: product._id,
        name: product.title,
        count: cartItem.count,
        color: cartItem.color,
        price: cartItem.price,
        subtotal: itemSubtotal,
      });

      // 📝 Préparer la mise à jour du stock
      stockUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $inc: {
              quantity: -cartItem.count,
              sold: cartItem.count,
            },
          },
        },
      });
    }

    // 🚚 Calculer les frais de livraison
    const shippingFee = user.cart.couponApplied?.freeShipping ? 0 : 10; // Frais fixes de 10$

    // 📊 Calculer les taxes (20% par défaut)
    const taxRate = 0.20;
    const taxAmount = subtotal * taxRate;

    // 💰 Appliquer la réduction du coupon si existante
    let discountAmount = user.cart.couponApplied?.discountAmount || 0;
    let couponApplied = null;

    if (user.cart.couponApplied) {
      const coupon = await Coupon.findById(user.cart.couponApplied.couponId);
      if (coupon) {
        couponApplied = {
          coupon: coupon._id,
          code: coupon.code || coupon.name,
          discountType: coupon.discountType,
          discountValue: coupon.discount,
        };

        // 📈 Incrémenter l'utilisation du coupon
        coupon.usageCount += 1;
        coupon.totalOrders += 1;
        coupon.totalDiscountGiven += discountAmount;
        await coupon.save();
      }
    }

    // 🔢 Calculer le montant total
    const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;

    // 🔧 Générer les détails de paiement
    const paymentIntent = {
      id: uniqid(),
      method: paymentMethod,
      amount: totalAmount,
      status: paymentMethod === "cash_on_delivery" ? "pending" : "processing",
      created: Date.now(),
      currency: "usd",
    };

    // 📦 Créer la commande
    const newOrder = await Order.create({
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      products: orderProducts,
      subtotal,
      shippingFee,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "processing",
      paymentIntent,
      shippingAddress: shippingAddress || {
        fullName: `${user.firstname} ${user.lastname}`,
        email: user.email,
        phone: user.mobile,
        ...(user.address && { address: user.address }),
      },
      orderby: userId,
      customerNotes,
      couponApplied,
      source: req.headers["user-agent"]?.includes("Mobile") ? "mobile_app" : "web",
    });

    // 📝 Mettre à jour les stocks des produits
    if (stockUpdates.length > 0) {
      await Product.bulkWrite(stockUpdates);
    }

    // 🗑️ Vider le panier de l'utilisateur
    user.cart = {
      products: [],
      cartTotal: 0,
      totalAfterDiscount: 0,
    };
    await user.save();

    // 📧 Envoyer un email de confirmation (à implémenter)
    // await sendOrderConfirmationEmail(user.email, newOrder);

    // ✅ Réponse
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order: {
          id: newOrder._id,
          orderNumber: newOrder.orderNumber,
          totalAmount: newOrder.totalAmount,
          orderStatus: newOrder.orderStatus,
          paymentStatus: newOrder.paymentStatus,
          createdAt: newOrder.createdAt,
        },
        summary: {
          subtotal,
          shippingFee,
          taxAmount,
          discountAmount,
          totalAmount,
        },
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    
    // Gérer les erreurs spécifiques
    if (error.message.includes("insufficient stock")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * 📋 RÉCUPÉRER LES COMMANDES DE L'UTILISATEUR
 * GET: /api/order/my-orders
 */
const getOrders = asyncHandler(async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { 
      page = 1, 
      limit = 10,
      status,
      sort = "-createdAt" 
    } = req.query;

    validateMongoDbId(userId);

    // 🔍 Construire la requête
    const query = { orderby: userId };
    if (status && status !== "all") {
      query.orderStatus = status;
    }

    // 📈 Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🗂️ Exécuter les requêtes
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("products.product", "title images")
        .select("-paymentIntent -adminNotes -ipAddress")
        .lean(),
      Order.countDocuments(query),
    ]);

    // 📊 Calculer les statistiques
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
        statistics: {
          totalOrders: total,
          totalSpent,
        },
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
});

/**
 * 👑 RÉCUPÉRER TOUTES LES COMMANDES (ADMIN)
 * GET: /api/order/all
 */
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate,
      search,
      sort = "-createdAt",
    } = req.query;

    // 🔍 Construire la requête
    const query = {};

    // 📊 Filtres
    if (status && status !== "all") query.orderStatus = status;
    if (paymentStatus && paymentStatus !== "all") query.paymentStatus = paymentStatus;

    // 📅 Filtre par date
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // 🔎 Recherche
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      ];
    }

    // 📈 Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🗂️ Exécuter les requêtes
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("orderby", "firstname lastname email")
        .populate("products.product", "title")
        .lean(),
      Order.countDocuments(query),
    ]);

    // 📊 Statistiques
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
        statistics: {
          totalOrders: total,
          totalRevenue,
          averageOrderValue,
        },
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
});

/**
 * 👤 RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR (ADMIN)
 * GET: /api/order/user/:userId
 */
const getOrderByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    validateMongoDbId(userId);

    // 👤 Vérifier l'utilisateur
    const user = await User.findById(userId).select("firstname lastname email");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 📈 Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🗂️ Récupérer les commandes
    const [orders, total] = await Promise.all([
      Order.find({ orderby: userId })
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit))
        .populate("products.product", "title images")
        .lean(),
      Order.countDocuments({ orderby: userId }),
    ]);

    // 📊 Statistiques
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "User orders retrieved successfully",
      data: {
        user,
        orders,
        statistics: {
          totalOrders: total,
          totalSpent,
          averageOrderValue: total > 0 ? totalSpent / total : 0,
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user orders",
    });
  }
});

/**
 * 📄 RÉCUPÉRER UNE COMMANDE PAR ID
 * GET: /api/order/:orderId
 */
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const { _id: userId } = req.user;

    validateMongoDbId(orderId);

    // 🔍 Récupérer la commande
    const order = await Order.findById(orderId)
      .populate("products.product", "title images slug")
      .populate("orderby", "firstname lastname email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔐 Vérifier les permissions (utilisateur ou admin)
    const isAdmin = req.user.role === "admin";
    const isOwner = order.orderby._id.toString() === userId.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
    });
  }
});

/**
 * 🔄 METTRE À JOUR LE STATUT D'UNE COMMANDE (ADMIN)
 * PUT: /api/order/status/:orderId
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    validateMongoDbId(orderId);

    // 🔍 Récupérer la commande
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔄 Définir les transitions valides
    const validTransitions = {
      "Not Processed": ["Processing", "Cancelled"],
      "Processing": ["Confirmed", "Cancelled"],
      "Confirmed": ["Dispatched", "Cancelled"],
      "Dispatched": ["Shipped", "Cancelled"],
      "Shipped": ["Out for Delivery", "Delivered"],
      "Out for Delivery": ["Delivered"],
      "Delivered": ["Returned", "Refunded"],
      "Cancelled": [],
      "Returned": ["Refunded"],
      "Refunded": [],
    };

    // 🚫 Vérifier la transition
    if (!validTransitions[order.orderStatus]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${order.orderStatus} to ${status}`,
      });
    }

    // 📝 Mettre à jour le statut
    order.orderStatus = status;
    
    // 💳 Mettre à jour le statut de paiement si livraison
    if (status === "Delivered") {
      order.paymentStatus = "completed";
      order.deliveredAt = new Date();
    }

    // 🔄 Restaurer les stocks si annulation
    if (status === "Cancelled") {
      const stockRestorations = order.products.map(item => ({
        updateOne: {
          filter: { _id: item.product },
          update: {
            $inc: {
              quantity: item.count,
              sold: -item.count,
            },
          },
        },
      }));

      if (stockRestorations.length > 0) {
        await Product.bulkWrite(stockRestorations);
      }
    }

    // 📝 Ajouter une note si fournie
    if (note) {
      order.adminNotes = note;
    }

    await order.save();

    // ✅ Réponse
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
});


module.exports = {
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
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderByUserId,
  removeProductFromCart,
  updateProductQuantity,
  getOrderById,
};
