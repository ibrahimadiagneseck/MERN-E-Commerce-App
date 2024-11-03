const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
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



// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
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
    throw new Error("Invalid Credentials");
  }
});

// admin login
const loginAdmin = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  // check if user exists or not
  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== "admin") throw new Error("Not Authorised");

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {

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
    throw new Error("Invalid Credentials");
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

// Middleware pour gérer le panier de l'utilisateur
const userCart = asyncHandler(async (req, res) => {

  // Récupère le panier depuis le corps de la requête et l'ID utilisateur depuis la requête (après authentification)
  const { cart } = req.body;
  const { _id } = req.user;

  // Vérifie si l'ID utilisateur est valide en utilisant une fonction de validation d'ID MongoDB
  validateMongoDbId(_id);

  try {
    // Initialise un tableau vide pour stocker les produits du panier
    let products = [];

    // Récupère l'utilisateur depuis la base de données en fonction de son ID
    const user = await User.findById(_id);

    // Vérifie si le panier existe déjà pour cet utilisateur
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });

    // Si un panier existe déjà, il est supprimé pour en créer un nouveau
    if (alreadyExistCart) {
      alreadyExistCart.deleteOne();
    }

    // Boucle sur chaque produit dans le panier pour structurer les informations nécessaires
    for (let i = 0; i < cart.length; i++) {
      let object = {};

      // Associe l'ID, la quantité et la couleur du produit
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      // Récupère uniquement le champ "price" du produit spécifié par son ID dans le panier
      let getPrice = await Product
        .findById(cart[i]._id) // Recherche le produit par son ID dans la base de données
        .select("price")       // Sélectionne uniquement le champ "price" pour optimiser la requête
        .exec();               // Exécute la requête et attend le résultat avec "await"


      // Associe le prix récupéré au produit
      object.price = getPrice.price;

      // Ajoute le produit structuré au tableau des produits
      products.push(object);
    }

    // Initialise la variable de calcul du total du panier
    let cartTotal = 0;

    // Boucle sur les produits pour calculer le total du panier (prix * quantité pour chaque produit)
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    // Crée un nouveau panier avec les produits, le total et l'utilisateur qui a passé la commande
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save(); // Sauvegarde le panier dans la base de données

    // Retourne le panier nouvellement créé en réponse
    res.json(newCart);

  } catch (error) {
    // En cas d'erreur, lance une nouvelle erreur pour la gestion des erreurs
    throw new Error(error);
  }
});


const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    // Recherche l'utilisateur par son ID
    const user = await User.findOne({ _id });

    // Utilise findOneAndDelete pour supprimer le panier associé à l'utilisateur
    const cart = await Cart.findOneAndDelete({ orderby: user._id });

    // Retourne la réponse avec le contenu du panier supprimé
    res.json(cart);
  } catch (error) {
    // Lève une erreur si quelque chose se passe mal
    throw new Error(error);
  }
});


const applyCoupon = asyncHandler(async (req, res) => {

  const { coupon } = req.body;
  const { _id } = req.user;
  
  validateMongoDbId(_id);

  // Cherche le coupon correspondant au nom donné dans la base de données
  const validCoupon = await Coupon.findOne({ name: coupon });

  // Si le coupon n'existe pas, génère une erreur pour informer l'utilisateur que le coupon est invalide
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }

  // Récupère l'utilisateur correspondant à l'ID
  const user = await User.findOne({ _id });

  // Récupère le total actuel du panier de l'utilisateur en recherchant un panier associé à cet utilisateur
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product"); // Charge également les détails des produits du panier

  // Calcule le total après application de la remise du coupon
  // La remise est calculée en fonction du pourcentage `discount` contenu dans le coupon
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2); // Utilise toFixed pour formater le résultat à deux décimales

  // Met à jour le panier de l'utilisateur avec le nouveau total après remise
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true } // Retourne le document mis à jour
  );

  // Envoie le total après remise en réponse à la requête
  res.json(totalAfterDiscount);
});


const createOrder = asyncHandler(async (req, res) => {

  // Récupère le type de paiement "Cash on Delivery" (COD) et si un coupon est appliqué
  const { COD, couponApplied } = req.body;

  const { _id } = req.user;

  validateMongoDbId(_id);

  try {

    // Si le paiement par COD n'est pas fourni, génère une erreur
    if (!COD) throw new Error("Create cash order failed");

    // Recherche l'utilisateur dans la base de données avec son ID
    const user = await User.findById(_id);

    // Récupère le panier de l'utilisateur en fonction de l'ID utilisateur
    let userCart = await Cart.findOne({ orderby: user._id });

    // Initialise le montant final de la commande
    let finalAmout = 0;

    // Détermine le montant final en tenant compte de la réduction si un coupon est appliqué
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    // Crée un nouvel objet de commande avec les détails du panier
    let newOrder = await new Order({
      products: userCart.products, // Les produits commandés
      paymentIntent: {
        id: uniqid(),               // Génère un identifiant unique pour la commande
        method: "COD",              // Méthode de paiement (Cash on Delivery)
        amount: finalAmout,         // Montant final de la commande
        status: "Cash on Delivery", // Statut du paiement
        created: Date.now(),        // Date de création
        currency: "usd",            // Devise de paiement
      },
      orderby: user._id,            // Identifiant de l'utilisateur ayant passé la commande
      orderStatus: "Cash on Delivery", // Statut de la commande
    }).save();

    // Met à jour les stocks et les ventes pour chaque produit dans le panier
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id }, // Trouve le produit correspondant
          update: { 
            $inc: { 
              quantity: -item.count,  // Diminue la quantité en stock en fonction de la quantité commandée
              sold: +item.count       // Augmente le nombre d'unités vendues
            }
          },
        },
      };
    });

    // Applique les mises à jour sur les produits en une seule requête avec `bulkWrite`
    const updated = await Product.bulkWrite(update, {});

    // Envoie une réponse JSON confirmant le succès de la commande
    res.json({ message: "success" });

  } catch (error) {
    // Gère les erreurs et les renvoie
    throw new Error(error);
  }
});


const getOrders = asyncHandler(async (req, res) => {

  const { _id } = req.user;

  validateMongoDbId(_id);

  try {

    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();

    res.json(userorders);

  } catch (error) {
    throw new Error(error);
  }

});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
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
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderByUserId,
};
