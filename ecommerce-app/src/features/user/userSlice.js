// features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./userService";
import { toast } from "react-toastify";

// ----------------------
//   THUNK REGISTER USER
// ----------------------
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      // Correction: Utiliser le message d'erreur correct
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      return response;
    } catch (error) {
      // Correction: Changer "Registration failed" par "Login failed"
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed"; // ← Correction ici

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserProductWishlist = createAsyncThunk(
  "user/wishlist",
  async (thunkAPI) => {
    try {
      return await authService.getUserWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addProdToCart = createAsyncThunk(
  "user/cart/add",
  async (cartData, thunkAPI) => {
    try {
      return await authService.addToCart(cartData); 
    } catch (error) {
      // Extraire uniquement les données sérialisables
      const errorData = {
        message: error.response?.data?.message || error.message || "Failed to add to cart",
        status: error.response?.status,
        statusText: error.response?.statusText
      };
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

const getCustomerfromLocalStorage = localStorage.getItem("customer")
  ? JSON.parse(localStorage.getItem("customer"))
  : null;

// ----------------------
//   INITIAL STATE
// ----------------------
const initialState = {
  user: getCustomerfromLocalStorage,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// ----------------------
//   AUTH SLICE
// ----------------------
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    logout: (state) => {
      state.user = null;
      state.isSuccess = false;
      localStorage.removeItem("token");
      toast.info("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      // --- REGISTER CASES ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Registration successful";
        // Afficher le toast ici, pas dans le composant
        toast.success("Account created successfully! Please login.");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Registration failed";
        // Toast d'erreur
        toast.error(state.message);
      })

      // --- LOGIN CASES ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Login successful";
        
        // Stocker le token
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
        
        // Toast de succès
        toast.success("Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Login failed";
        // Toast d'erreur
        toast.error(state.message);
      })


      .addCase(getUserProductWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProductWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.wishlist = action.payload;
      })
      .addCase(getUserProductWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(addProdToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProdToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProduct = action.payload;
        if (state.success) {
          toast.success("Product Added to Cart");
        }
      })
      .addCase(addProdToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;