const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler"); // Gère les erreurs de manière asynchrone
const slugify = require("slugify"); // Génère des slugs à partir des titres de produits
const validateMongoDbId = require("../utils/validateMongodbId"); // Valide les ID MongoDB

// Créer un nouveau produit
const createProduct = asyncHandler(async (req, res) => {
  try {
    // Si le titre du produit est fourni, générer un slug
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // Créer un nouveau produit dans la base de données
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});

// Mettre à jour un produit existant
const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params; // Récupérer l'ID du produit à partir des paramètres d'URL
  validateMongoDbId(id); // Valider l'ID MongoDB

  try {
    // Si le titre est mis à jour, générer un nouveau slug
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // Mettre à jour le produit dans la base de données
    const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
      new: true, // Retourne le document mis à jour
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});

// Supprimer un produit
const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params; // Récupérer l'ID du produit à partir des paramètres d'URL
  validateMongoDbId(id); // Valider l'ID MongoDB

  try {
    // Supprimer le produit de la base de données
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});

// Récupérer un produit spécifique
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du produit
  validateMongoDbId(id); // Valider l'ID MongoDB

  try {
    // Rechercher le produit par son ID
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});

// Récupérer tous les produits avec filtres, tri, limitation de champs et pagination
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtrage des champs exclus
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Conversion des opérateurs (gte, gt, lte, lt) en syntaxe MongoDB
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Tri des résultats
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); // Par défaut, trier par date de création décroissante
    }

    // Limiter les champs retournés
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // Exclure la version __v par défaut
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Vérification de la validité de la page
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exist");
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});

// Ajouter ou retirer un produit à/du wishlist d'un utilisateur
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Récupérer l'ID de l'utilisateur connecté
  const { prodId } = req.body; // Récupérer l'ID du produit à ajouter/supprimer

  try {
    const user = await User.findById(_id); // Récupérer les informations de l'utilisateur
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId); // Vérifier si le produit est déjà dans la wishlist

    if (alreadyadded) {
      // Si le produit est déjà dans la wishlist, le retirer
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId }, // Supprimer le produit de la wishlist
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      // Si le produit n'est pas dans la wishlist, l'ajouter
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId }, // Ajouter le produit à la wishlist
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});

// Ajouter ou mettre à jour la note d'un produit
const rating = asyncHandler(async (req, res) => {

  const { _id } = req.user; // Récupérer l'ID de l'utilisateur connecté
  const { star, prodId, comment } = req.body; // Récupérer les informations de la note et du commentaire

  try {
    const product = await Product.findById(prodId); // Trouver le produit par son ID

    // Vérifier si l'utilisateur a déjà noté ce produit
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      // Mettre à jour la note et le commentaire existants
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      // Ajouter une nouvelle note pour ce produit
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    // Calculer la nouvelle note moyenne
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);

    // Mettre à jour la note totale du produit
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});

// Export des fonctions pour les utiliser dans d'autres fichiers
module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
