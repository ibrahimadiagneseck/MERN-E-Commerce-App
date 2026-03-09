// Redux Toolkit helpers
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Service qui communique avec l’API (axios)
import { productService } from "./productService";

/* ======================================================
   ASYNC THUNKS (Appels API)
   ====================================================== */

// 🔹 Récupérer tous les produits
export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async (_, thunkAPI) => {
    try {
      // Appel au service
      return await productService.getProducts();
    } catch (error) {
      // Gestion centralisée des erreurs
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Récupérer un seul produit par ID
export const getProduct = createAsyncThunk(
  "product/getOne",
  async (id, thunkAPI) => {
    try {
      return await productService.getSingleProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🔹 Ajouter / retirer un produit de la wishlist
export const addToWishlist = createAsyncThunk(
  "product/addToWishlist",
  async (prodId, thunkAPI) => {
    try {
      return await productService.addToWishlist(prodId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);




/* ======================================================
   INITIAL STATE
   ====================================================== */

const initialState = {
  products: [],        // Liste de tous les produits
  product: null,       // Produit sélectionné (SingleProduct)
  wishlist: null,      // Réponse API wishlist
  isLoading: false,    // Indique un chargement en cours
  isSuccess: false,    // Indique une requête réussie
  isError: false,      // Indique une erreur
  message: "",         // Message d’erreur
};

/* ======================================================
   SLICE
   ====================================================== */

const productSlice = createSlice({
  name: "product",
  initialState,

  // Reducers synchrones
  reducers: {
    // Reset complet du state (utile au logout ou changement de page)
    resetProductState: () => initialState,
  },

  // Reducers asynchrones (thunks)
  extraReducers: (builder) => {
    builder

      /* ==================== GET ALL PRODUCTS ==================== */
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload; // Stockage de la liste
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ==================== GET SINGLE PRODUCT ==================== */
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload; // Produit unique
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ==================== ADD TO WISHLIST ==================== */
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.wishlist = action.payload; // Réponse backend
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

// Export des actions
export const { resetProductState } = productSlice.actions;

// Export du reducer
export default productSlice.reducer;
