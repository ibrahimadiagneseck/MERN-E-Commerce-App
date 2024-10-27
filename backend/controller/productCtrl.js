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
  const { id } = req.params; // Récupérer l'ID du produit à partir des paramètres d'URL
  validateMongoDbId(id); // Valider l'ID MongoDB

  try {
    // Si le titre est mis à jour, générer un nouveau slug
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // Mettre à jour le produit dans la base de données
    const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true, // Retourne le document mis à jour
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error); // Gérer les erreurs
  }
});


// Supprimer un produit
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du produit à partir des paramètres d'URL
  validateMongoDbId(id); // Valider l'ID MongoDB

  try {
    // Supprimer le produit de la base de données
    const deleteProduct = await Product.findOneAndDelete({ _id: id });
    if (!deleteProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json({ message: "Produit supprimé avec succès", deleteProduct });
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
    // Copie les paramètres de requête pour exclure certains champs
    // On clone l'objet req.query pour éviter de modifier l'original
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"]; // Champs à exclure des filtres (gérés séparément)
    
    // Supprimer les champs exclus des filtres de requête
    excludeFields.forEach((el) => delete queryObj[el]);

    // Convertir les opérateurs (gte, gt, lte, lt) en syntaxe MongoDB
    // Exemple: {price: {gte: 500}} devient {price: {$gte: 500}}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    // Effectuer la requête MongoDB avec les filtres transformés
    let query = Product.find(JSON.parse(queryStr));

    // Gestion du tri des résultats
    if (req.query.sort) {
      // Si des critères de tri sont passés dans la requête, on les utilise
      // Les critères sont séparés par des virgules, donc on les convertit en format MongoDB (espaces)
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      // Par défaut, trier par date de création décroissante
      query = query.sort("-createdAt");
    }

    // Limiter les champs retournés
    if (req.query.fields) {
      // Sélectionne uniquement les champs spécifiques si 'fields' est fourni dans la requête
      // On transforme la liste de champs séparés par des virgules en une chaîne avec des espaces pour MongoDB
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      // Par défaut, exclure le champ __v (qui correspond à la version du document dans Mongoose)
      query = query.select("-__v");
    }

    // Pagination des résultats
    // Par exemple, si page=2 et limit=10, on saute les 10 premiers résultats pour afficher la page 2
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Vérification si la page demandée existe
    if (req.query.page) {
      // Compter le nombre total de documents pour valider la pagination
      const productCount = await Product.countDocuments();
      // Si l'utilisateur demande une page qui dépasse le nombre de produits disponibles, on renvoie une erreur
      if (skip >= productCount) throw new Error("This Page does not exist");
    }

    // Exécuter la requête finale et retourner les produits
    const product = await query;
    res.json(product);
  } catch (error) {
    // Si une erreur survient, elle est gérée ici et un message d'erreur est renvoyé
    throw new Error(error);
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
      // Mise à jour de la notation d'un produit avec de nouveaux détails d'évaluation
      const updateRating = await Product.updateOne(
        {
          // Critère de recherche : recherche un produit dont l'un des éléments de l'attribut `ratings` correspond à `alreadyRated`
          // `$ elemMatch` vérifie si un élément dans le tableau `ratings` correspond à la condition définie dans `alreadyRated`
          ratings: { $elemMatch: alreadyRated },
        },
        {
          // Action de mise à jour : `ratings.$` cible l'élément correspondant dans `ratings` (là où `$ elemMatch` a trouvé une correspondance)
          // `$ set` permet de modifier les champs spécifiques de l'élément ciblé
          // Mise à jour de la note (`star`) et du commentaire (`comment`) pour l'élément trouvé
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          // Option de configuration : retourne le document mis à jour après la modification
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
