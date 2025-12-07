// Import des dépendances Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authServices";

// Récupération de l'utilisateur depuis le localStorage au chargement initial
const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

// État initial du slice d'authentification
const initialState = {
  user: getUserfromLocalStorage,      // Utilisateur connecté (null si non connecté)
  orders: [],                         // Liste des commandes
  orderbyuser: [],                    // Ajout de cette propriété manquante
  isError: false,                     // Indicateur d'erreur
  isLoading: false,                   // Indicateur de chargement
  isSuccess: false,                   // Indicateur de succès
  message: "",                        // Message d'état
};

// Thunk asynchrone pour l'action de connexion
export const login = createAsyncThunk(
  "auth/login",                       // Nom de l'action
  async (userData, thunkAPI) => {     // Fonction asynchrone
    try {
      // Appel du service d'authentification
      return await authService.login(userData);
    } catch (error) {
      // CORRECTION : Extraire seulement le message d'erreur, pas l'objet AxiosError complet
      const errorMessage = error.response?.data?.message || error.message || "Erreur de connexion";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Thunk asynchrone pour récupérer toutes les commandes
export const getOrders = createAsyncThunk(
  "order/get-orders",                 // Nom de l'action
  async (thunkAPI) => {               // Pas de paramètre, seulement thunkAPI
    try {
      return await authService.getOrders();
    } catch (error) {
      // CORRECTION : Extraire seulement le message d'erreur
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la récupération des commandes";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Thunk asynchrone pour récupérer les commandes d'un utilisateur spécifique
export const getOrderByUser = createAsyncThunk(
  "order/get-order",                  // Nom de l'action
  async (id, thunkAPI) => {           // Prend l'ID de l'utilisateur en paramètre
    try {
      return await authService.getOrder(id);
    } catch (error) {
      // CORRECTION : Extraire seulement le message d'erreur
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la récupération des commandes utilisateur";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Création du slice Redux pour l'authentification
export const authSlice = createSlice({
  name: "auth",                       // Nom du slice
  initialState: initialState,         // État initial
  reducers: {
    // CORRECTION : Ajouter un reducer pour effacer les erreurs
    clearError: (state) => {
      state.isError = false;
      state.message = "";
    },
  },                      
  extraReducers: (builder) => {      // Gestion des thunks asynchrones - CORRECTION : typo "buildeer" -> "builder"
    builder
      // Gestion du login
      .addCase(login.pending, (state) => {
        state.isLoading = true;       // Début du chargement
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;        // Réinitialisation des états
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;  // Stockage des données utilisateur
        state.message = "success";
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;         // Gestion des erreurs
        state.isSuccess = false;
        // CORRECTION : Utiliser action.payload au lieu de action.error
        state.message = action.payload || "Erreur de connexion";
        state.isLoading = false;
      })
      
      // Gestion de la récupération des commandes
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload; // Stockage de toutes les commandes
        state.message = "success";
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        // CORRECTION : Utiliser action.payload au lieu de action.error
        state.message = action.payload || "Erreur lors de la récupération des commandes";
        state.isLoading = false;
      })
      
      // Gestion de la récupération des commandes par utilisateur
      .addCase(getOrderByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orderbyuser = action.payload; // Stockage des commandes de l'utilisateur
        state.message = "success";
      })
      .addCase(getOrderByUser.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        // CORRECTION : Utiliser action.payload au lieu de action.error
        state.message = action.payload || "Erreur lors de la récupération des commandes utilisateur";
        state.isLoading = false;
      });
  },
});

// CORRECTION : Export des actions
export const { clearError } = authSlice.actions;

// AJOUT DES SELECTEURS MANQUANTS (nécessaires pour Login.js)
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.message;  // Note: message contient l'erreur
export const selectIsAuthenticated = (state) => !!state.auth.user;

// Autres selecteurs utiles
export const selectUser = (state) => state.auth.user;
export const selectOrders = (state) => state.auth.orders;
export const selectUserOrders = (state) => state.auth.orderbyuser;
export const selectIsSuccess = (state) => state.auth.isSuccess;
export const selectIsError = (state) => state.auth.isError;

// Export du reducer pour l'ajouter au store Redux
export default authSlice.reducer;