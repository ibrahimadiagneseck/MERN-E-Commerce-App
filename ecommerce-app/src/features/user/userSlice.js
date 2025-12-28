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
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed";

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
      const message = error.response?.data?.message || error.message || "Failed to add to cart";
      
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error(message);
      }
      
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getUserCart = createAsyncThunk(
  "user/cart/get",
  async (thunkAPI) => {
    try {
      return await authService.getCart();
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to get cart";
      
      if (error.response?.status === 401) {
        toast.error("Please login to view cart");
      } else {
        toast.error(message);
      }
      
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Nouveau thunk pour vider le panier
export const emptyUserCart = createAsyncThunk(
  "user/cart/empty",
  async (thunkAPI) => {
    try {
      return await authService.emptyCart();
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to empty cart";
      toast.error(message);
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Nouveau thunk pour supprimer un produit du panier
export const removeProductFromUserCart = createAsyncThunk(
  "user/cart/remove",
  async (data, thunkAPI) => {
    try {
      return await authService.removeProductFromCart(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to remove product";
      toast.error(message);
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Nouveau thunk pour mettre à jour la quantité
export const updateProductQuantityInCart = createAsyncThunk(
  "user/cart/update-quantity",
  async (data, thunkAPI) => {
    try {
      return await authService.updateProductQuantity(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to update quantity";
      toast.error(message);
      return thunkAPI.rejectWithValue({ message });
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
  cartProducts: null,
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
      state.cartProducts = null;
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
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
        toast.success("Account created successfully! Please login.");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Registration failed";
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
        
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
        
        toast.success("Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Login failed";
        toast.error(state.message);
      })

      // --- WISHLIST CASES ---
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

      // --- ADD TO CART CASES ---
      .addCase(addProdToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProdToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProduct = action.payload;
        toast.success("Product Added to Cart");
      })
      .addCase(addProdToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      // --- GET CART CASES ---
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProducts = action.payload;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      // --- EMPTY CART CASES ---
      .addCase(emptyUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(emptyUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProducts = action.payload;
        toast.success("Cart emptied successfully");
      })
      .addCase(emptyUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      // --- REMOVE PRODUCT FROM CART CASES ---
      .addCase(removeProductFromUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeProductFromUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProducts = action.payload;
        toast.success("Product removed from cart");
      })
      .addCase(removeProductFromUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      // --- UPDATE QUANTITY CASES ---
      .addCase(updateProductQuantityInCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProductQuantityInCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProducts = action.payload;
      })
      .addCase(updateProductQuantityInCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;