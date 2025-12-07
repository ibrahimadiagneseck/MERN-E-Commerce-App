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
      // En cas d'erreur, rejeter avec la valeur de l'erreur
      return thunkAPI.rejectWithValue(error);
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
      return thunkAPI.rejectWithValue(error);
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
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Création du slice Redux pour l'authentification
export const authSlice = createSlice({
  name: "auth",                       // Nom du slice
  initialState: initialState,         // État initial
  reducers: {},                       // Reducers synchrones (aucun ici)
  extraReducers: (buildeer) => {      // Gestion des thunks asynchrones
    buildeer
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
        state.message = action.error;
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
        state.message = action.error;
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
        state.message = action.error;
        state.isLoading = false;
      });
  },
});

// Export du reducer pour l'ajouter au store Redux
export default authSlice.reducer;