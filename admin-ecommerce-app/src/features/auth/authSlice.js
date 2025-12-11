// Import des dépendances Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authServices";

// Récupération de l'utilisateur depuis le localStorage au chargement initial
const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

// État initial du slice d'authentification
const initialState = {
  user: getUserfromLocalStorage,
  orders: [],
  orderbyuser: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  errorMessage: "",  // Changement: séparer errorMessage
  successMessage: "", // Changement: séparer successMessage
};

// Thunk asynchrone pour l'action de connexion
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erreur de connexion";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Thunk asynchrone pour récupérer toutes les commandes
export const getOrders = createAsyncThunk(
  "order/get-orders",
  async (thunkAPI) => {
    try {
      return await authService.getOrders();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la récupération des commandes";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Thunk asynchrone pour récupérer les commandes d'un utilisateur spécifique
export const getOrderByUser = createAsyncThunk(
  "order/get-order",
  async (id, thunkAPI) => {
    try {
      return await authService.getOrder(id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la récupération des commandes utilisateur";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Création du slice Redux pour l'authentification
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.errorMessage = "";
    },
    clearSuccess: (state) => {
      state.isSuccess = false;
      state.successMessage = "";
    },
    clearAllMessages: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.errorMessage = "";
      state.successMessage = "";
    },
    logout: (state) => {
      state.user = null;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
      state.successMessage = "";
      localStorage.removeItem("user");
    }
  },
  extraReducers: (builder) => {
    builder
      // Gestion du login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.successMessage = "Connexion réussie";
        state.errorMessage = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.payload || "Erreur de connexion";
        state.successMessage = "";
        state.isLoading = false;
      })
      
      // Gestion de la récupération des commandes
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
        state.errorMessage = "";
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.payload || "Erreur lors de la récupération des commandes";
        state.isLoading = false;
      })
      
      // Gestion de la récupération des commandes par utilisateur
      .addCase(getOrderByUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getOrderByUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orderbyuser = action.payload;
        state.errorMessage = "";
      })
      .addCase(getOrderByUser.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.payload || "Erreur lors de la récupération des commandes utilisateur";
        state.isLoading = false;
      });
  },
});

// Export des actions
export const { clearError, clearSuccess, clearAllMessages, logout } = authSlice.actions;

// Selecteurs
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.errorMessage; // Utilise errorMessage
export const selectSuccessMessage = (state) => state.auth.successMessage; // Utilise successMessage
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsSuccess = (state) => state.auth.isSuccess;
export const selectIsError = (state) => state.auth.isError;
export const selectUser = (state) => state.auth.user;
export const selectOrders = (state) => state.auth.orders;
export const selectUserOrders = (state) => state.auth.orderbyuser;

// Export du reducer
export default authSlice.reducer;