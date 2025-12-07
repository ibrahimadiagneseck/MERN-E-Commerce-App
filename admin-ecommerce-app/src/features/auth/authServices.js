// Import des dépendances
import axios from "axios";
import { config } from "../../utils/axiosconfig";  // Configuration axios (probablement les headers, token, etc.)
import { base_url } from "../../utils/baseUrl";    // URL de base de l'API

// Service de connexion administrateur
const login = async (user) => {
  try {
    // Envoi d'une requête POST à l'endpoint de connexion admin
    const response = await axios.post(`${base_url}user/admin-login`, user);
    
    // Si la réponse contient des données
    if (response.data) {
      // Stockage des données utilisateur dans le localStorage pour la persistance de session
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    
    // Retour des données de réponse (probablement token + infos utilisateur)
    return response.data;
  } catch (error) {
    // CORRECTION : Lancer une erreur avec un message pour que Redux puisse la capturer
    throw error;
  }
};

// Service pour récupérer toutes les commandes
const getOrders = async () => {
  try {
    // Envoi d'une requête GET à l'endpoint des commandes
    // Utilisation de la configuration axios (probablement avec token d'authentification)
    const response = await axios.get(`${base_url}user/getallorders`, config);

    // Retour des données de commandes
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Service pour récupérer les commandes d'un utilisateur spécifique
const getOrder = async (id) => {
  try {
    // Envoi d'une requête POST à l'endpoint des commandes par utilisateur
    // Note: POST est utilisé ici bien qu'on récupère des données
    // Le deuxième paramètre est une chaîne vide (probablement pour le body)
    const response = await axios.post(
      `${base_url}user/getorderbyuser/${id}`,  // URL avec l'ID utilisateur
      "",                                      // Body vide
      config                                   // Configuration avec headers d'authentification
    );

    // Retour des données de commandes de l'utilisateur
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export des services sous forme d'objet
const authService = {
  login,
  getOrders,
  getOrder,
};

export default authService;