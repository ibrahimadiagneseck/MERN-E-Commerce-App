const Enquiry = require("../models/enqModel"); // Import du modèle Enquiry pour interagir avec la collection MongoDB
const asyncHandler = require("express-async-handler"); // Middleware pour capturer et gérer les erreurs dans les fonctions async Express
const validateMongoDbId = require("../utils/validateMongodbId"); // Fonction utilitaire pour valider les IDs MongoDB

/**
 * Fonction pour créer une nouvelle enquête
 * @param {Object} req - Objet requête contenant les données de l'enquête à créer
 * @param {Object} res - Objet réponse pour renvoyer l'enquête créée au client
 */
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    // Crée une nouvelle enquête à partir des données reçues dans le corps de la requête
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry); // Renvoie l'enquête créée sous forme de réponse JSON
  } catch (error) {
    throw new Error(error); // Gère les erreurs potentielles lors de la création de l'enquête
  }
});

/**
 * Fonction pour mettre à jour une enquête existante
 * @param {Object} req - Objet requête contenant l'ID de l'enquête à mettre à jour et les nouvelles données
 * @param {Object} res - Objet réponse pour renvoyer l'enquête mise à jour au client
 */
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params; // Récupère l'ID de l'enquête à mettre à jour depuis les paramètres de la requête
  validateMongoDbId(id); // Valide l'ID MongoDB avant de procéder

  try {
    // Met à jour l'enquête avec les nouvelles données et retourne l'objet mis à jour
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true, // Retourne l'enquête mise à jour plutôt que l'ancienne version
    });
    res.json(updatedEnquiry); // Renvoie l'enquête mise à jour sous forme de réponse JSON
  } catch (error) {
    throw new Error(error); // Gère les erreurs potentielles lors de la mise à jour
  }
});

/**
 * Fonction pour supprimer une enquête existante
 * @param {Object} req - Objet requête contenant l'ID de l'enquête à supprimer
 * @param {Object} res - Objet réponse pour renvoyer la confirmation de suppression
 */
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params; // Récupère l'ID de l'enquête à supprimer depuis les paramètres de la requête
  validateMongoDbId(id); // Valide l'ID MongoDB avant de procéder

  try {
    // Supprime l'enquête spécifiée par son ID
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deletedEnquiry); // Renvoie l'enquête supprimée sous forme de réponse JSON
  } catch (error) {
    throw new Error(error); // Gère les erreurs potentielles lors de la suppression
  }
});

/**
 * Fonction pour obtenir une enquête spécifique par son ID
 * @param {Object} req - Objet requête contenant l'ID de l'enquête à récupérer
 * @param {Object} res - Objet réponse pour renvoyer l'enquête récupérée au client
 */
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params; // Récupère l'ID de l'enquête à consulter depuis les paramètres de la requête
  validateMongoDbId(id); // Valide l'ID MongoDB avant de procéder

  try {
    // Recherche l'enquête par son ID
    const getaEnquiry = await Enquiry.findById(id);
    res.json(getaEnquiry); // Renvoie l'enquête sous forme de réponse JSON
  } catch (error) {
    throw new Error(error); // Gère les erreurs potentielles lors de la récupération de l'enquête
  }
});

/**
 * Fonction pour obtenir toutes les enquêtes
 * @param {Object} req - Objet requête (pas de paramètres nécessaires)
 * @param {Object} res - Objet réponse pour renvoyer toutes les enquêtes
 */
const getallEnquiry = asyncHandler(async (req, res) => {
  try {
    // Récupère toutes les enquêtes
    const getallEnquiry = await Enquiry.find();
    res.json(getallEnquiry); // Renvoie toutes les enquêtes sous forme de réponse JSON
  } catch (error) {
    throw new Error(error); // Gère les erreurs potentielles lors de la récupération des enquêtes
  }
});

// Export des fonctions pour les utiliser dans les routes ou d'autres parties de l'application
module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
};
