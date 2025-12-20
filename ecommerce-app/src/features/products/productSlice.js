// features/user/userSlice.js
// Ce fichier contient le slice Redux pour la gestion des produits

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { authService } from "./userService"; // Service d'authentification (commenté)
// import { toast } from "react-toastify"; // Pour les notifications (commenté)
import { productService } from "./productService"; // Service pour les opérations sur les produits

// ============================================================================
// THUNK ASYNCHRONE : RÉCUPÉRATION DE TOUS LES PRODUITS
// ============================================================================

/**
 * Thunk asynchrone pour récupérer tous les produits
 * @async
 * @function getAllProducts
 * @param {Object} thunkAPI - L'API thunk de Redux Toolkit
 * @returns {Promise} Promesse résolue avec les produits ou rejetée avec une erreur
 */
export const getAllProducts = createAsyncThunk(
  "product/get", // Nom de l'action : "product/get"
  async (thunkAPI) => {
    try {
      // Appel au service pour récupérer les produits
      const response = await productService.getProducts();
      return response; // Retourne la réponse en cas de succès
    } catch (error) {
      // Gestion d'erreur détaillée
      const message =
        error.response?.data?.message || // Message d'erreur du serveur
        error.message || // Message d'erreur JavaScript
        "failed"; // Message par défaut

      // Rejette la promesse avec la valeur d'erreur
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ============================================================================
// THUNK ASYNCHRONE : AJOUTER UN PRODUIT À LA LISTE DE SOUHAITS
// ============================================================================

/**
 * Thunk asynchrone pour ajouter un produit à la liste de souhaits
 * @async
 * @function addToWishlist
 * @param {string} prodId - ID du produit à ajouter à la liste de souhaits
 * @param {Object} thunkAPI - L'API thunk de Redux Toolkit
 * @returns {Promise} Promesse résolue avec la réponse ou rejetée avec une erreur
 */
export const addToWishlist = createAsyncThunk(
  "product/wishlist", // Nom de l'action : "product/wishlist"
  async (prodId, thunkAPI) => {
    try {
      // Appel au service pour ajouter à la liste de souhaits
      const response = await productService.addToWishlist(prodId);
      return response; // Retourne la réponse en cas de succès
    } catch (error) {
      // Gestion d'erreur détaillée
      const message =
        error.response?.data?.message || // Message d'erreur du serveur
        error.message || // Message d'erreur JavaScript
        "failed"; // Message par défaut

      // Rejette la promesse avec la valeur d'erreur
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ============================================================================
// ÉTAT INITIAL DU SLICE
// ============================================================================

/**
 * État initial du slice produit
 * @type {Object}
 * @property {string|Array|Object} product - Données des produits (initialisé comme string vide)
 * @property {boolean} isError - Indique si une erreur est survenue
 * @property {boolean} isSuccess - Indique si l'opération a réussi
 * @property {boolean} isLoading - Indique si une opération est en cours
 * @property {string} message - Message d'information ou d'erreur
 */
const productState = {
  product: '', // Devrait probablement être un tableau [] ou un objet {} au lieu d'une string
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// ============================================================================
// CREATION DU SLICE
// ============================================================================

export const productSlice = createSlice({
  name: "product", // Nom du slice
  initialState: productState, // État initial
  reducers: {
    // Reducers synchrones (aucun défini actuellement)
    // Exemple: on pourrait ajouter un reducer pour réinitialiser l'état
    // resetProductState: (state) => {
    //   state.product = '';
    //   state.isError = false;
    //   state.isSuccess = false;
    //   state.isLoading = false;
    //   state.message = "";
    // }
  },
  
  // Reducers asynchrones (gestion des thunks)
  extraReducers: (builder) => {
    builder
      // ======================================================================
      // CASES POUR getAllProducts
      // ======================================================================
      
      // En cours de chargement
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        // Note: On ne réinitialise pas les autres flags ici
        // Ce qui pourrait être un problème si on a déjà une erreur précédente
      })
      
      // Succès
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.product = action.payload; // Stocke les produits récupérés
        // Note: On ne définit pas de message de succès
      })
      
      // Échec (BUG DÉTECTÉ ici)
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = true; // BUG: devrait être `false` car le chargement est terminé
        state.isError = false; // BUG: devrait être `true` caar il y a une erreur
        state.isSuccess = false;
        state.message = action.error; // Stocke l'erreur
        // BUG: action.payload contient le message d'erreur, pas action.error
      })
      
      // ======================================================================
      // CASES POUR addToWishlist
      // ======================================================================
      
      // En cours de chargement
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      
      // Succès
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.addToWishlist = action.payload; // BUG: Cette propriété n'existe pas dans l'état initial
        state.message = "Product Added To wishlist !"; // Message de succès
      })
      
      // Échec
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error; // BUG: Devrait être action.payload
      });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

// Export des actions (aucune action synchrone définie actuellement)
// export const { resetState, logout } = authSlice.actions;

// Export du reducer
export default productSlice.reducer;